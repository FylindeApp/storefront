// Ensure TypeScript recognizes IntersectionObserver
interface IntersectionObserverEntry {
    readonly isIntersecting: boolean;
}



// Extend the `window` object to include SpeechRecognition properties
interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
}

declare var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
} | undefined;

declare var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
} | undefined;
