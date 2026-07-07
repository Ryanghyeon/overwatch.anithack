import './LoadingSpinner.css';

// text 프롭스를 받아서 글자 변경 용이
export function LoadingSpinner({ text = "데이터를 불러오는 중..." }) {
    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <div className="global-spinner"></div>
            {text && <h2 className="global-spinner-text">{text}</h2>}
        </div>
    );
}