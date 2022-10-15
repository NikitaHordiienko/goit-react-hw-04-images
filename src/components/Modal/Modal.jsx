import { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import css from './Modal.module.css'

export default function Modal({ onModalClose, src, alt }) {

    useEffect(() => {
        const handleCloseKey = event => {

            if (event.code === 'Escape') {
                onModalClose();
            }
        };
        window.addEventListener('keydown', handleCloseKey);

        return () => window.removeEventListener('keydown', handleCloseKey);

    }, [onModalClose]);

    const handleModaleClose = event => {
        
        if (event.target === event.currentTarget) {
            onModalClose();
        }
    }

    const jsx = (
        <div className={css.overlay} onClick={handleModaleClose}>
            <div className={css.modal}>
                <img src={src} alt={alt} />
            </div>
        </div>
    )
    return ReactDOM.createPortal( jsx, document.getElementById('modal')
    )
}

Modal.propTypes = {
    onModalClose: PropTypes.func.isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
}