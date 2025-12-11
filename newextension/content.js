browser.runtime.onMessage.addListener((request) => {
    if (request.type === "body_color") {
        document.body.style.backgroundColor = request.color;
    } else if (request.type === "text_color") {
        document.body.style.color = request.color;
    } else if (request.type === "div_color") {
        const divs = document.getElementsByTagName('div');
        for (let i = 0; i < divs.length; i++) {
            divs[i].style.backgroundColor = request.color;
        }
    }
});

// Create a single bottom-left container and append buttons into it so they are spaced nicely.
(function() {
            const CONTAINER_ID = 'color-picker-btn-container';

            const btnDefs = [
                { id: 'open-popup', text: 'Open popup', onClick: () => { console.log('opening the popup'); try { browser.browserAction.openPopup(); } catch(e) {} } },
                { id: 'close-popup', text: 'Close popup', onClick: () => { console.log('closing the popup'); try { browser.browserAction.closePopup(); } catch(e) {} } },
                { id: 'position-top-right', text: 'Top Right', onClick: () => { browser.browserAction.setPopupPosition({ top: '20px', right: '50px'}) } },
                { id: 'position-top-left', text: 'Top Left', onClick: () => { browser.browserAction.setPopupPosition({ top: '40px', left: '60px'}) } },
                { id: 'position-bottom-left', text: 'Bottom Left', onClick: () => { browser.browserAction.setPopupPosition({ bottom: '20px', left: '150px'}) } },
                { id: 'position-bottom-right', text: 'Bottom Right', onClick: () => { browser.browserAction.setPopupPosition({ bottom: '40px', right: '50px'}) } },
                { id: 'resize-popup', text: 'Resize Popup', onClick: () => { browser.browserAction.resizePopup(50,50) } },

            ];

            function createContainer() {
                let container = document.getElementById(CONTAINER_ID);
                if (!container) {
                    container = document.createElement('div');
                    container.id = CONTAINER_ID;
                    Object.assign(container.style, {
                        position: 'fixed',
                        bottom: '20px',
                        left: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        alignItems: 'flex-start',
                        zIndex: 2147483647,
                        pointerEvents: 'auto'
                    });
                    document.body.appendChild(container);
                }
                return container;
            }

            function createButtons() {
                const container = createContainer();

                btnDefs.forEach(def => {
                    // Remove any previous instance with same id
                    const prev = document.getElementById(def.id);
                    if (prev) prev.remove();

                    const btn = document.createElement('button');
                    btn.id = def.id;
                    btn.textContent = def.text;
                    Object.assign(btn.style, {
                        padding: '8px 12px',
                        background: '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        minWidth: '110px',
                        textAlign: 'left'
                    });

                    btn.addEventListener('click', (e) => {
                        try { def.onClick(e); } catch (err) { console.error('button handler error', err); }
                    });

                    container.appendChild(btn);
                });
            }

            if (document.body) {
                createButtons();
            } else {
                window.addEventListener('load', createButtons);
            }
        })();