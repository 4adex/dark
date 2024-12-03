import React from 'react';

interface CardProps {
    heading: string;
    imageSrc: string;
    content: string;
    primaryButton?: string;
    onPrimaryButtonClick?: () => void;
}

const Card: React.FC<CardProps> = ({ heading, imageSrc, content, primaryButton, onPrimaryButtonClick}) => {
    return (
        <div className="feature-card">
        <div className="feature-header">
            <div className='feature-icon-title'>
                <img src={imageSrc} alt="Card" className='feature-icon' />
                <h3 className="feature-title">{heading}</h3>
            </div>
            <p className="feature-description">{content}</p>
        </div>
        <div className="feature-button-wrapper">
                 <button className="feature-button" onClick={onPrimaryButtonClick}>{primaryButton}</button>
        </div>
        </div>


        // <div className= "card">
        //     <div className="card-header">
        //         <div className="card-image"><img src={imageSrc} alt="Card" /></div>
        //         <div style={{ marginLeft: "1rem", marginBottom: "1.5rem" }}>
        //             <div className="card-heading">{heading}</div>
        //             <div className="card-content">{content}</div>
        //         </div>
        //     </div>
        //     <div className="buttons">
        //         {secondaryButton && <button className="secondary-button" onClick={onSecondaryButtonClick}>{secondaryButton}</button>}
        //         {tertiaryButton && <button className="tertiary-button" onClick={onTertiaryButtonClick}>{tertiaryButton}</button>}
        //         {primaryButton && <button className="primary-button" onClick={onPrimaryButtonClick}>{primaryButton}</button>}
        //     </div>
        // </div>
    );
};

export default Card;
