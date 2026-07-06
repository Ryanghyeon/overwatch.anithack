// src/components/Footer/Footer.jsx

import { useCopyToClipboard } from '@/hooks';
import './Footer.css';

export function Footer() {
    const { isCopied, copyToClipboard } = useCopyToClipboard();

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <p className="footer-copyright">
                    © 2026 <span className="footer-brand">OW Watch</span>. All rights reserved.
                </p>

                <p className="footer-disclaimer">
                    Not affiliated with Blizzard Entertainment. Overwatch is a trademark of Blizzard Entertainment, Inc.
                </p>

                <div className="footer-links">
                    {/* 복사 버튼 */}
                    <button
                        onClick={() => copyToClipboard("admin@owwatch.com")}
                        className={`footer-link btn-link ${isCopied ? 'copied' : ''}`}
                    >
                        {isCopied ? "✅ 이메일 복사 완료!" : "✉️ 관리자 이메일 (클릭해서 복사)"}
                    </button>

                    <span className="footer-divider">|</span>

                    {/* 디스코드 링크 */}
                    <a
                        href="https://discord.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                    >
                        Join Discord
                    </a>
                </div>
            </div>
        </footer>
    );
}