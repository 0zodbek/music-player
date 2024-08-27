import React, { useState, useEffect } from 'react';
import './AudioPlayer.css';
import musicData from './assets/music.json';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';

function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showTrackList, setShowTrackList] = useState(false);
    const audioRef = React.useRef(null);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        setCurrentTrack((prev) => (prev + 1) % musicData.length);
        setIsPlaying(false);
    };

    const prevTrack = () => {
        setCurrentTrack((prev) => (prev - 1 + musicData.length) % musicData.length);
        setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleSeek = (event) => {
        const seekTime = event.target.value;
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const seekForward = () => {
        audioRef.current.currentTime += 10; // 10 soniya oldinga
    };

    const seekBackward = () => {
        audioRef.current.currentTime -= 10; // 10 soniya orqaga
    };

    useEffect(() => {
        const handleEnded = () => {
            nextTrack();
            audioRef.current.play();
        };

        audioRef.current.addEventListener('ended', handleEnded);
        return () => {
            audioRef.current.removeEventListener('ended', handleEnded);
        };
    }, []);

    useEffect(() => {
        audioRef.current.src = musicData[currentTrack].url;
        if (isPlaying) {
            audioRef.current.play();
        }
    }, [currentTrack]);

    // Media Session API
    useEffect(() => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: musicData[currentTrack].title,
                artist: 'Jaloliddin Ahmadaliyev', // San'atkor nomi
                album: 'Musiqa', // Albom nomi
                artwork: [
                    { src: 'path/to/your/image.jpg', sizes: '96x96', type: 'image/jpeg' },
                    { src: 'path/to/your/image.jpg', sizes: '128x128', type: 'image/jpeg' },
                    { src: 'path/to/your/image.jpg', sizes: '192x192', type: 'image/jpeg' },
                    { src: 'path/to/your/image.jpg', sizes: '256x256', type: 'image/jpeg' },
                    { src: 'path/to/your/image.jpg', sizes: '384x384', type: 'image/jpeg' },
                    { src: 'path/to/your/image.jpg', sizes: '512x512', type: 'image/jpeg' },
                ]
            });

            navigator.mediaSession.setActionHandler('play', () => {
                togglePlay();
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                togglePlay();
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                prevTrack();
            });
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                nextTrack();
            });
        }
    }, [currentTrack, isPlaying]);

    return (
        <div className="audio-player flex flex-col">
            <audio 
                ref={audioRef} 
                onTimeUpdate={handleTimeUpdate}
            />
            <h3>{musicData[currentTrack].title}</h3>
            <div className="time-display">
                <span>{Math.floor(currentTime / 60)}:{('0' + Math.floor(currentTime % 60)).slice(-2)}</span>
                <input 
                    type="range" 
                    min="0" 
                    max={audioRef.current ? audioRef.current.duration : 0} 
                    value={currentTime} 
                    onChange={handleSeek} 
                />
                <span>{audioRef.current ? Math.floor(audioRef.current.duration / 60) + ':' + ('0' + Math.floor(audioRef.current.duration % 60)).slice(-2) : '0:00'}</span>
            </div>
            <div className="controls">
            <button className="seek-button" onClick={seekBackward}>-10s</button>
                <button className="nav-button" onClick={prevTrack}>
                    <FaStepBackward />
                </button>
                <button className="play-button" onClick={togglePlay}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button className="nav-button" onClick={nextTrack}>
                    <FaStepForward />
                </button>
                <button className="seek-button" onClick={seekForward}>+10s</button>
              </div>
            <div>
            <button className="toggle-track-list" onClick={() => setShowTrackList(!showTrackList)}>
                    {showTrackList ? 'Hide Tracks' : 'Show Tracks'}
                </button>
            {showTrackList && (
                <ul className="track-list">
                    {musicData.map((track, index) => (
                        <li key={index} onClick={() => setCurrentTrack(index)}>
                            {track.title}
                        </li>
                    ))}
                </ul>
            )}
            </div>
        </div>
    );
}

export default AudioPlayer;
