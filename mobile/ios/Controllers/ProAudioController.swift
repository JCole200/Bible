import AVFoundation

/**
 * ProAudioController (v1.0)
 * High-fidelity 3-track synchronization engine for the Transform Pro Bible Suite.
 * Handles exact-millisecond playback for Narrator, Ambience, and Score.
 */
class ProAudioController: NSObject {
    
    private var narratorPlayer: AVAudioPlayer?
    private var ambiencePlayer: AVAudioPlayer?
    private var scorePlayer: AVAudioPlayer?
    
    private let fadeDuration: TimeInterval = 0.5
    
    override init() {
        super.init()
        setupAudioSession()
    }
    
    private func setupAudioSession() {
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [.mixWithOthers])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("❌ Audio Session Error: \(error.localizedDescription)")
        }
    }
    
    /**
     * Initializes the streams for synchronous playback.
     */
    func loadTracks(narrator: URL, ambience: URL, score: URL) {
        do {
            narratorPlayer = try AVAudioPlayer(contentsOf: narrator)
            ambiencePlayer = try AVAudioPlayer(contentsOf: ambience)
            scorePlayer = try AVAudioPlayer(contentsOf: score)
            
            // Prepare to play minimizes latency
            narratorPlayer?.prepareToPlay()
            ambiencePlayer?.prepareToPlay()
            scorePlayer?.prepareToPlay()
            
            print("🚀 Tracks Loaded & Primed for Sync.")
        } catch {
            print("❌ Initialisation Failure: \(error.localizedDescription)")
        }
    }
    
    /**
     * Requirement: Start all tracks at the exact same millisecond.
     */
    func playSynchronized() {
        guard let n = narratorPlayer, let a = ambiencePlayer, let s = scorePlayer else { return }
        
        // Calculate a start time slightly in the future (100ms) to ensure all hardware buffers are ready
        let startTime = n.deviceCurrentTime + 0.1
        
        // Ensure initial volume is 0 if we are fading in
        n.volume = 0
        a.volume = 0
        s.volume = 0
        
        n.play(atTime: startTime)
        a.play(atTime: startTime)
        s.play(atTime: startTime)
        
        // Trigger high-end fade-in
        n.setVolume(1.0, fadeDuration: fadeDuration)
        a.setVolume(0.4, fadeDuration: fadeDuration) // Default ambient level
        s.setVolume(0.3, fadeDuration: fadeDuration) // Default score level
        
        print("⚡ Synchronized Playback Initiated at \(startTime)")
    }
    
    /**
     * Requirement: High-end Fade-out logic for all tracks.
     */
    func stopWithFade() {
        let players = [narratorPlayer, ambiencePlayer, scorePlayer]
        
        players.forEach { $0?.setVolume(0, fadeDuration: fadeDuration) }
        
        // Schedule local stop after fade completes
        DispatchQueue.main.asyncAfter(deadline: .now() + fadeDuration) {
            players.forEach { $0?.stop() }
            print("🔇 Playback Faded to Zero & Stopped.")
        }
    }
    
    /**
     * Requirement: Customized user mix.
     */
    func setMix(voiceVol: Float, ambientVol: Float, scoreVol: Float) {
        narratorPlayer?.setVolume(voiceVol, fadeDuration: 0.1)
        ambiencePlayer?.setVolume(ambientVol, fadeDuration: 0.3)
        scorePlayer?.setVolume(scoreVol, fadeDuration: 0.3)
        print("🎚 Mix Updated: V:\(voiceVol) A:\(ambientVol) S:\(scoreVol)")
    }
}
