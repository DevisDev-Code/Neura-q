import { motion } from 'framer-motion'
import { ArrowLeft, FileText, AlertTriangle, Scale, Users, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const TermsOfService = () => {
  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="p-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-all duration-300 hover:translate-x-1"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/90 to-indigo-950/90 border border-purple-400/30">
                  <FileText className="w-8 h-8 text-purple-300" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-orange-300 bg-clip-text text-transparent">
                  Terms of Service
                </h1>
              </div>
              <p className="text-purple-100/80 text-lg">
                The rules and guidelines for using Neura-Q
              </p>
              <p className="text-purple-100/60 text-sm mt-2">
                Last updated: June 2025
              </p>
            </div>

            {/* Content */}
            <div className="bg-gradient-to-br from-purple-950/90 to-indigo-950/90 border border-purple-400/30 rounded-2xl p-8 backdrop-blur-sm space-y-8">
              
              {/* Agreement */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-purple-300">Agreement to Terms</h2>
                </div>
                <p className="text-purple-100/80 leading-relaxed">
                  By accessing and using Neura-Q, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
                <div className="bg-black/20 rounded-lg p-4 border border-purple-400/20">
                  <p className="text-purple-100/70 text-sm leading-relaxed">
                    <strong className="text-purple-200">Important:</strong> If you do not agree to abide by the above, 
                    please do not use this service. These terms apply to all visitors, users, and others who access or use the service.
                  </p>
                </div>
              </section>

              {/* Service Description */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-purple-300">Service Description</h2>
                </div>
                <p className="text-purple-100/80 leading-relaxed">
                  Neura-Q is an AI-powered decision support platform that helps users explore complex decisions through 
                  structured analysis using three specialized AI agents: Aeon, Nova, and Tess.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-black/20 rounded-lg p-4 border border-cyan-400/20 text-center">
                    <div className="text-2xl mb-2">🧭</div>
                    <h3 className="text-cyan-200 font-semibold mb-1">Aeon</h3>
                    <p className="text-purple-100/60 text-xs">Strategic thinking and decision tree analysis</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4 border border-purple-400/20 text-center">
                    <div className="text-2xl mb-2">🧠</div>
                    <h3 className="text-purple-200 font-semibold mb-1">Nova</h3>
                    <p className="text-purple-100/60 text-xs">Consequence mapping and chain of thought</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4 border border-orange-400/20 text-center">
                    <div className="text-2xl mb-2">🚀</div>
                    <h3 className="text-orange-200 font-semibold mb-1">Tess</h3>
                    <p className="text-purple-100/60 text-xs">Scenario exploration and validation</p>
                  </div>
                </div>
              </section>

              {/* Acceptable Use */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-purple-300">Acceptable Use</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-black/20 rounded-lg p-4 border border-green-400/20">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">✅ Encouraged Uses</h3>
                    <ul className="text-green-100/70 text-sm space-y-1">
                      <li>• Personal decision-making and life choices</li>
                      <li>• Business strategy and planning</li>
                      <li>• Educational exploration of decision frameworks</li>
                      <li>• Creative problem-solving and brainstorming</li>
                      <li>• Professional development decisions</li>
                    </ul>
                  </div>

                  <div className="bg-black/20 rounded-lg p-4 border border-red-400/20">
                    <h3 className="text-lg font-semibold text-red-300 mb-2">❌ Prohibited Uses</h3>
                    <ul className="text-red-100/70 text-sm space-y-1">
                      <li>• Illegal activities or harmful content</li>
                      <li>• Medical, legal, or financial advice as professional counsel</li>
                      <li>• Harassment, abuse, or discriminatory content</li>
                      <li>• Attempting to reverse-engineer our AI systems</li>
                      <li>• Sharing or selling access to your account</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* AI Limitations */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                  <h2 className="text-2xl font-bold text-purple-300">AI Limitations & Disclaimers</h2>
                </div>
                
                <div className="bg-gradient-to-r from-orange-950/50 to-red-950/50 border border-orange-400/30 rounded-lg p-6">
                  <h3 className="text-orange-200 font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Important Disclaimers
                  </h3>
                  <div className="space-y-4 text-orange-100/80 text-sm leading-relaxed">
                    <p>
                      <strong>Not Professional Advice:</strong> Neura-Q provides AI-generated insights for exploration and 
                      consideration only. Our analysis is not a substitute for professional medical, legal, financial, 
                      or therapeutic advice.
                    </p>
                    <p>
                      <strong>AI Limitations:</strong> Our AI agents may produce inaccurate, incomplete, or biased 
                      responses. Always use critical thinking and consult qualified professionals for important decisions.
                    </p>
                    <p>
                      <strong>Personal Responsibility:</strong> You are solely responsible for any decisions you make 
                      based on insights from Neura-Q. We encourage using our platform as one tool among many in your 
                      decision-making process.
                    </p>
                  </div>
                </div>
              </section>

              {/* Liability */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-purple-300">Limitation of Liability</h2>
                <div className="bg-black/20 rounded-lg p-6 border border-purple-400/20">
                  <p className="text-purple-100/80 leading-relaxed mb-4">
                    Neura-Q and its creators shall not be liable for any indirect, incidental, special, consequential, 
                    or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
                    intangible losses, resulting from your use of the service.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-purple-200 font-semibold mb-2">We Are Not Responsible For:</h3>
                      <ul className="text-purple-100/70 text-sm space-y-1">
                        <li>• Decisions made using our insights</li>
                        <li>• Accuracy of AI-generated content</li>
                        <li>• Outcomes of implemented strategies</li>
                        <li>• Third-party integrations or services</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-purple-200 font-semibold mb-2">Your Responsibilities:</h3>
                      <ul className="text-purple-100/70 text-sm space-y-1">
                        <li>• Verify information independently</li>
                        <li>• Consult professionals when needed</li>
                        <li>• Use the service responsibly</li>
                        <li>• Maintain account security</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Account Terms */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-purple-300">Account Terms</h2>
                <div className="space-y-4">
                  <div className="bg-black/20 rounded-lg p-4 border border-purple-400/20">
                    <h3 className="text-purple-200 font-semibold mb-2">Account Security</h3>
                    <p className="text-purple-100/70 text-sm leading-relaxed">
                      You are responsible for maintaining the security of your account and all activities that occur 
                      under your account. Notify us immediately of any unauthorized use.
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4 border border-purple-400/20">
                    <h3 className="text-purple-200 font-semibold mb-2">Service Availability</h3>
                    <p className="text-purple-100/70 text-sm leading-relaxed">
                      We strive to maintain high availability but cannot guarantee uninterrupted service. We may 
                      temporarily suspend service for maintenance, updates, or technical issues.
                    </p>
                  </div>
                </div>
              </section>

              {/* Termination */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-purple-300">Termination</h2>
                <p className="text-purple-100/80 leading-relaxed">
                  We may terminate or suspend your account and access to the service immediately, without prior notice 
                  or liability, for any reason, including breach of these Terms.
                </p>
                <div className="bg-black/20 rounded-lg p-4 border border-purple-400/20">
                  <p className="text-purple-100/70 text-sm leading-relaxed">
                    Upon termination, your right to use the service will cease immediately. If you wish to terminate 
                    your account, you may simply discontinue using the service or contact us for account deletion.
                  </p>
                </div>
              </section>

              {/* Changes to Terms */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-purple-300">Changes to Terms</h2>
                <p className="text-purple-100/80 leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                  we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              {/* Contact */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-purple-300">Contact Information</h2>
                <div className="bg-black/20 rounded-lg p-6 border border-purple-400/20">
                  <p className="text-purple-100/80 leading-relaxed mb-4">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="flex flex-col md:flex-row gap-4">
                    <a 
                      href="mailto:devansh.khanna88@gmail.com"
                      className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      devansh.khanna88@gmail.com"
                    </a>
                    <span className="text-purple-100/60">•</span>
                    <span className="text-purple-100/70">
                      We respond to all inquiries within 48 hours
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService