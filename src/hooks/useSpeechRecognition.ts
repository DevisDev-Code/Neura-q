import { useState, useRef, useEffect, useCallback } from 'react'

export type SpeechField = 'context' | 'problem' | 'mindset' | 'successMetrics'

interface UseSpeechRecognitionProps {
    onTranscript: (field: SpeechField, final: string, interim: string) => void
}

export const useSpeechRecognition = ({ onTranscript }: UseSpeechRecognitionProps) => {
    const [isSupported, setIsSupported] = useState(false)
    const [activeField, setActiveField] = useState<SpeechField | null>(null)

    const recognitionRef = useRef<any>(null)
    const listeningRef = useRef(false)
    const activeFieldRef = useRef<SpeechField | null>(null)

    useEffect(() => {
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
            setIsSupported(false)
            return
        }

        setIsSupported(true)
        const rec = new SpeechRecognition()
        rec.continuous = true
        rec.interimResults = true
        rec.lang = 'en-US'

        rec.onresult = (event: any) => {
            let finalChunk = ''
            let interimChunk = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const res = event.results[i]
                const transcript = res[0]?.transcript || ''
                if (res.isFinal) {
                    finalChunk += transcript + ' '
                } else {
                    interimChunk += transcript + ' '
                }
            }

            if (activeFieldRef.current) {
                onTranscript(activeFieldRef.current, finalChunk, interimChunk)
            }
        }

        rec.onend = () => {
            if (listeningRef.current) {
                try {
                    rec.start()
                } catch (_) {
                    // ignore
                }
            } else {
                setActiveField(null)
            }
        }

        recognitionRef.current = rec

        return () => {
            listeningRef.current = false
            rec.stop()
        }
    }, [onTranscript])

    const startListening = useCallback((field: SpeechField) => {
        if (!recognitionRef.current) return

        setActiveField(field)
        activeFieldRef.current = field
        listeningRef.current = true

        try {
            recognitionRef.current.start()
        } catch (_) {
            // already started
        }
    }, [])

    const stopListening = useCallback(() => {
        listeningRef.current = false
        activeFieldRef.current = null
        setActiveField(null)

        try {
            recognitionRef.current?.stop()
        } catch (_) {
            // ignore
        }
    }, [])

    return { isSupported, activeField, startListening, stopListening }
}
