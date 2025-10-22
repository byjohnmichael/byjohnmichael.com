import React, { useRef, useState, MouseEvent, useEffect } from 'react';
import { Link as CustomLink } from '../components/CustomLink';
import QRCode from 'qrcode';

const Donate: React.FC = () => {
    const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
    const animationFrameRefs = useRef<(number | undefined)[]>([undefined, undefined, undefined, undefined]);
    const [qrCodeDataURLs, setQrCodeDataURLs] = useState<string[]>(['', '', '', '']);
    
    const donationData = [
        {
            name: 'Venmo',
            address: '@byjohnmichael',
            qrUrl: 'https://account.venmo.com/u/byjohnmichael',
            className: 'venmo-card',
            logo: '/images/logos/venmo.png'
        },
        {
            name: 'Bitcoin',
            address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            qrUrl: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            className: 'bitcoin-card',
            logo: '/images/logos/bitcoin.png'
        },
        {
            name: 'Ethereum',
            address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
            qrUrl: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
            className: 'ethereum-card',
            logo: '/images/logos/ethereum.png'
        },
        {
            name: 'Solana',
            address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
            qrUrl: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
            className: 'solana-card',
            logo: '/images/logos/solana.png'
        }
    ];

    useEffect(() => {
        const generateQRCodes = async () => {
            try {
                const qrPromises = donationData.map(async (data) => {
                    return await QRCode.toDataURL(data.qrUrl, {
                        width: 120,
                        margin: 0,
                        color: {
                            dark: '#000000',
                            light: '#FFFFFF'
                        }
                    });
                });
                
                const qrDataURLs = await Promise.all(qrPromises);
                setQrCodeDataURLs(qrDataURLs);
            } catch (error) {
                console.error('Error generating QR codes:', error);
            }
        };
        generateQRCodes();
    }, []);

    useEffect(() => {
        return () => {
            animationFrameRefs.current.forEach(frame => {
                if (frame) {
                    cancelAnimationFrame(frame);
                }
            });
        };
    }, []);

    const handleCopyAddress = (address: string) => {
        navigator.clipboard.writeText(address);
    };

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>, cardIndex: number) => {
        if (animationFrameRefs.current[cardIndex]) {
            cancelAnimationFrame(animationFrameRefs.current[cardIndex]!);
        }

        animationFrameRefs.current[cardIndex] = requestAnimationFrame(() => {
            const rect = cardRefs.current[cardIndex]?.getBoundingClientRect();
            if (!rect) return;

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const px = (x / rect.width - 0.5) * 2; // -1..1
            const py = (y / rect.height - 0.5) * 2; // -1..1

            const rotateX = Math.max(-1, Math.min(1, -py)) * 6; // clamp and scale
            const rotateY = Math.max(-1, Math.min(1, px)) * 6;
            const translateX = px * 6;
            const translateY = py * 6;

            if (cardRefs.current[cardIndex]) {
                cardRefs.current[cardIndex]!.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${translateX}px, ${translateY}px)`;
                cardRefs.current[cardIndex]!.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2 + 12}px 40px rgba(0, 0, 0, 0.2)`;
            }
        });
    };

    const handleMouseLeave = (cardIndex: number) => {
        if (animationFrameRefs.current[cardIndex]) {
            cancelAnimationFrame(animationFrameRefs.current[cardIndex]!);
        }
        
        if (cardRefs.current[cardIndex]) {
            cardRefs.current[cardIndex]!.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translate(0, 0)';
            cardRefs.current[cardIndex]!.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
        }
    };

    return (
        <div className="App donate-page">
            <nav className="nav-immediate" aria-label="Primary">
                <ul>
                    <li><CustomLink to="/projects">Projects</CustomLink></li>
                    <li><CustomLink to="/" className="nav-brand">By John Michael</CustomLink></li>
                    <li><CustomLink to="/donate">Donate</CustomLink></li>
                </ul>
            </nav>
            
            <div className="donate-header">
                <h1>Support Me</h1>
                <p>Free feel to donate to support me in my vision to create exceptional products. Cryptocurrency is preferred.</p>
            </div>
            
            <section id="donate" className="donate-center">
                <div className="donation-grid">
                    {donationData.map((data, index) => (
                        <div
                            key={data.name}
                            className={`donation-module hover-tilt ${data.className}`}
                            ref={(el) => { cardRefs.current[index] = el; }}
                            onMouseMove={(e) => handleMouseMove(e, index)}
                            onMouseLeave={() => handleMouseLeave(index)}
                        >
                            <div className="donation-header">
                                <div className="logo-and-title">
                                    <img src={data.logo} alt={`${data.name} logo`} className="donation-logo" />
                                    <h3>{data.name}</h3>
                                </div>
                                <div className="qr-code-placeholder">
                                    {qrCodeDataURLs[index] ? (
                                        <img src={qrCodeDataURLs[index]} alt={`${data.name} QR Code`} className="qr-code-image" />
                                    ) : (
                                        <div className="qr-code">
                                            <div className="qr-pattern"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="donation-address">
                                <div className="address-container">
                                    <div className="address-text">{data.address}</div>
                                    <button className="copy-icon-button" onClick={() => handleCopyAddress(data.address)} title="Copy address">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Donate;
