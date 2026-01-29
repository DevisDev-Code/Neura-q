import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface AnalysisRequest {
  fileName: string
  originalName: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Authentication required')
    }

    const { fileName, originalName }: AnalysisRequest = await req.json()

    // Download file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('data-analysis')
      .download(fileName)

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`)
    }

    // Convert file to base64 for Gemini API
    const arrayBuffer = await fileData.arrayBuffer()
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    
    // Determine file type
    const fileExtension = originalName.toLowerCase().split('.').pop()
    let mimeType = 'text/csv'
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }

    // Call Gemini API for analysis
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured')
    }

    const analysisPrompt = `
Analyze the uploaded dataset comprehensively. Perform data cleaning (handle missing values, remove duplicates, standardize formats), generate descriptive statistics, create relevant visualizations, and build appropriate predictive models (regression, classification, or clustering as suitable). 

Return a complete Python script with all analysis code, data cleaning steps, visualization code, and modeling implementation. Also provide a structured JSON report containing: summary statistics, key findings, visualization metadata, model performance metrics, and actionable insights.

Please format your response as a JSON object with two keys:
1. "python_script": Complete Python code as a string
2. "json_report": Structured analysis report as a JSON object

The Python script should be production-ready and include all necessary imports, data loading, cleaning, analysis, visualization, and modeling code.
`

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: analysisPrompt
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 32,
          topP: 1,
          maxOutputTokens: 8192,
        }
      })
    })

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`)
    }

    const geminiResult = await geminiResponse.json()
    
    if (!geminiResult.candidates || geminiResult.candidates.length === 0) {
      throw new Error('No analysis results generated')
    }

    const analysisText = geminiResult.candidates[0].content.parts[0].text
    
    // Try to parse the JSON response from Gemini
    let parsedResult
    try {
      // Extract JSON from the response (Gemini might wrap it in markdown)
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else {
        // Fallback: create structured response
        parsedResult = {
          python_script: analysisText,
          json_report: {
            summary: "Analysis completed",
            findings: ["Data analysis performed successfully"],
            recommendations: ["Review the generated Python script for detailed insights"]
          }
        }
      }
    } catch (parseError) {
      // Fallback response if JSON parsing fails
      parsedResult = {
        python_script: analysisText,
        json_report: {
          summary: "Analysis completed",
          findings: ["Data analysis performed successfully"],
          recommendations: ["Review the generated Python script for detailed insights"],
          error: "Could not parse structured report"
        }
      }
    }

    // Store analysis results in database
    const { error: dbError } = await supabaseClient
      .from('data_analyses')
      .insert({
        user_id: user.id,
        file_name: originalName,
        analysis_results: parsedResult,
        created_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Database error:', dbError)
      // Continue anyway, don't fail the request
    }

    // Return the results
    return new Response(
      JSON.stringify({
        pythonScript: parsedResult.python_script,
        jsonReport: JSON.stringify(parsedResult.json_report, null, 2)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Analysis error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Analysis failed',
        details: 'Please check your file format and try again'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})