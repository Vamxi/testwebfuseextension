console.log('Content script loaded');

// Create UI container
const createUI = () => {
    let container =  document.getElementById('controlPanelContainer');
    if (container) {
        return container;
    }
    // Create main container if it is not there yet
    container = document.createElement('div');
    container.id = 'controlPanelContainer';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.padding = '20px';
    container.style.maxWidth = '800px';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.left = '20px';
    container.style.zIndex = '9999';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '5px';
    container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    container.style.pointerEvents = 'auto';

    container.innerHTML = `
        <h2 style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #ccc;">Session Lifecycle</h2>
        <div class="btn-group" style="margin-bottom: 10px;">
            <button id="get-session-info" style="margin: 5px; padding: 8px; cursor: pointer;">Get Session Info</button>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <label for="redirect-url" style="width: 120px;">Redirect URL:</label>
                <input type="text" id="redirect-url" placeholder="https://example.com" style="margin: 5px; padding: 8px; width: 250px;">
            </div>
            <button id="end-session" style="margin: 5px; padding: 8px; cursor: pointer;">End Session</button>
        </div>

        <h2 style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #ccc;">Misc</h2>
        <div class="btn-group" style="margin-bottom: 10px;">
            <button id="get-participants" style="margin: 5px; padding: 8px; cursor: pointer;">Get Participants</button>
            <button id="toggle-drawing" style="margin: 5px; padding: 8px; cursor: pointer;">Toggle Drawing</button>
            <input type="file" id="file-upload" style="margin: 5px;">
            <button id="upload-file" style="margin: 5px; padding: 8px; cursor: pointer;">Upload File</button>
        </div>

        <div id="result" style="margin-top: 20px; padding: 10px; background-color: #f5f5f5; border: 1px solid #ddd; min-height: 100px;">
            <h3>Results:</h3>
            <pre id="result-content"></pre>
        </div>

        <button id="toggle-panel" style="position: absolute; top: 5px; right: 5px; cursor: pointer;">×</button>
    `;

    document.body.appendChild(container);
    return container;
};

// Create UI and add listeners once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const container = createUI();
    
    // Helper function to display results
    function displayResult(result) {
        const resultContent = document.getElementById('result-content');
        if (typeof result === 'object') {
            resultContent.textContent = JSON.stringify(result, null, 2);
        } else {
            resultContent.textContent = result?.toString() || 'Command executed';
        }
    }

    // Toggle panel visibility
    document.getElementById('toggle-panel').addEventListener('click', () => {
        const isMinimized = container.style.width === '30px';
        if (isMinimized) {
            container.style.width = 'auto';
            container.style.height = 'auto';
            document.getElementById('toggle-panel').textContent = '×';
        } else {
            container.style.width = '30px';
            container.style.height = '30px';
            container.style.overflow = 'hidden';
            document.getElementById('toggle-panel').textContent = '+';
        }
    });

    // Session Lifecycle
    document.getElementById('get-session-info').addEventListener('click', () => {
        // This is Promise-based
        browser.webfuseSession.getSessionInfo(info => {
            console.log('Session info:', info);
            displayResult(info);
        });
    });

    document.getElementById('end-session').addEventListener('click', () => {
        const redirectUrl = document.getElementById('redirect-url').value;
        browser.webfuseSession.end(redirectUrl);
        console.log('Session ended');
        displayResult('Session ended with redirect: ' + (redirectUrl || 'none'));
    });

    // Participants
    document.getElementById('get-participants').addEventListener('click', () => {
        console.log('Getting participants');
        browser.webfuseSession.getParticipants(participants => {
            console.log('Participants:', participants);
            displayResult(participants);
        });
    });
    
    // Toggle Drawing
    document.getElementById('toggle-drawing').addEventListener('click', () => {
        browser.webfuseSession.toggleDrawing();
        console.log('Drawing toggled');
        displayResult('Drawing toggled');
    });

    // File Upload
    document.getElementById('upload-file').addEventListener('click', () => {
        const fileInput = document.getElementById('file-upload');
        if (fileInput.files.length === 0) {
            console.log('Please select a file first');
            displayResult('Please select a file first');
            return;
        }
        browser.webfuseSession.uploadFile(fileInput.files[0]);
        console.log('File uploaded:', fileInput.files[0].name);
        displayResult('File uploaded: ' + fileInput.files[0].name);
    });
});

// Alternative: If DOMContentLoaded already fired, run immediately
if (document.readyState !== 'loading') {
    const container = createUI();
    // Function calls would go here (same as above)
}
