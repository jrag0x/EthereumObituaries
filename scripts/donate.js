(function () {
    const dialog = document.getElementById('donate-dialog');
    const form = dialog && dialog.querySelector('.donate-form');
    const amountStep = document.getElementById('donate-amount-step');
    const walletStep = document.getElementById('donate-wallet-step');
    const amountActions = document.getElementById('donate-amount-actions');
    const walletActions = document.getElementById('donate-wallet-actions');
    const amountInput = document.getElementById('donate-amount');
    const submitButton = document.getElementById('donate-submit');
    const backButton = document.getElementById('donate-back');
    const status = document.getElementById('donate-status');
    const walletPrompt = document.getElementById('donate-wallet-prompt');
    const walletList = document.getElementById('donate-wallet-list');
    const qrContainer = document.getElementById('donate-qr');
    const openWalletLink = document.getElementById('donate-open-wallet');
    const copyAddressButton = document.getElementById('donate-copy-address');
    const triggers = document.querySelectorAll('[data-donate-trigger]');

    if (!dialog || !form || !amountInput || !submitButton || !status || typeof dialog.showModal !== 'function') return;

    const recipient = '0xA0143fb27fdFDBd9888B5E0B3CEB58B6B50d0799';
    const announcedProviders = new Map();
    let donationWei = null;

    function rememberProvider(event) {
        const detail = event.detail;
        if (!detail || !detail.info || !detail.provider || !detail.info.uuid) return;
        announcedProviders.set(detail.info.uuid, detail);
    }

    window.addEventListener('eip6963:announceProvider', rememberProvider);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    function amountToWei(value) {
        const normalized = value.trim().replace(',', '.');
        if (!/^\d+(\.\d{1,18})?$/.test(normalized)) return null;

        const [whole, fraction = ''] = normalized.split('.');
        const wei = (BigInt(whole) * (10n ** 18n)) + BigInt(fraction.padEnd(18, '0'));
        return wei > 0n ? wei : null;
    }

    function paymentUri(wei) {
        return `ethereum:${recipient}@1?value=${wei.toString()}`;
    }

    function showAmountStep() {
        amountStep.hidden = false;
        amountActions.hidden = false;
        walletStep.hidden = true;
        walletActions.hidden = true;
        status.textContent = '';
        amountInput.focus();
    }

    function openDialog(event) {
        event.preventDefault();
        showAmountStep();
        dialog.showModal();
    }

    function createWalletButton(detail) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'donate-wallet-button';

        if (detail.info.icon && detail.info.icon.startsWith('data:image/')) {
            const icon = document.createElement('img');
            icon.className = 'donate-wallet-icon';
            icon.src = detail.info.icon;
            icon.alt = '';
            button.appendChild(icon);
        }

        const name = document.createElement('span');
        name.textContent = detail.info.name || 'Ethereum wallet';
        button.appendChild(name);
        button.addEventListener('click', function () {
            sendDonation(detail.provider);
        });
        return button;
    }

    function renderWalletChoices() {
        walletList.replaceChildren();
        const providers = Array.from(announcedProviders.values());

        if (providers.length === 0 && window.ethereum && typeof window.ethereum.request === 'function') {
            providers.push({
                info: { name: 'Browser wallet' },
                provider: window.ethereum
            });
        }

        providers
            .sort((a, b) => (a.info.name || '').localeCompare(b.info.name || ''))
            .forEach((detail) => walletList.appendChild(createWalletButton(detail)));

        walletPrompt.textContent = providers.length
            ? 'Choose an installed wallet:'
            : 'No browser wallet was detected.';
    }

    function renderQr(uri) {
        qrContainer.replaceChildren();
        if (typeof window.qrcode !== 'function') {
            qrContainer.hidden = true;
            return;
        }

        const code = window.qrcode(0, 'M');
        code.addData(uri);
        code.make();
        qrContainer.innerHTML = code.createSvgTag({ scalable: true, margin: 2 });
        qrContainer.hidden = false;
    }

    function showWalletStep() {
        const uri = paymentUri(donationWei);
        renderWalletChoices();
        renderQr(uri);
        openWalletLink.href = uri;
        amountStep.hidden = true;
        amountActions.hidden = true;
        walletStep.hidden = false;
        walletActions.hidden = false;
        status.textContent = '';
    }

    async function sendDonation(provider) {
        status.textContent = 'Check your wallet…';
        walletList.querySelectorAll('button').forEach((button) => { button.disabled = true; });

        try {
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            if (!accounts || !accounts[0]) throw new Error('No wallet account returned.');

            const chainId = await provider.request({ method: 'eth_chainId' });
            if (chainId !== '0x1') {
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x1' }]
                });
            }

            await provider.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: accounts[0],
                    to: recipient,
                    value: `0x${donationWei.toString(16)}`
                }]
            });

            dialog.close();
            amountInput.value = '';
        } catch (error) {
            status.textContent = error && error.code === 4001
                ? 'Request cancelled in the wallet.'
                : 'The transaction could not be prepared. Try another wallet or scan the QR code.';
        } finally {
            walletList.querySelectorAll('button').forEach((button) => { button.disabled = false; });
        }
    }

    async function copyAddress() {
        try {
            await navigator.clipboard.writeText(recipient);
        } catch (error) {
            const temporaryInput = document.createElement('textarea');
            temporaryInput.value = recipient;
            temporaryInput.setAttribute('readonly', '');
            temporaryInput.className = 'visually-hidden';
            document.body.appendChild(temporaryInput);
            temporaryInput.select();
            document.execCommand('copy');
            temporaryInput.remove();
        }

        status.textContent = 'Address copied.';
    }

    triggers.forEach((trigger) => trigger.addEventListener('click', openDialog));
    backButton.addEventListener('click', showAmountStep);
    copyAddressButton.addEventListener('click', copyAddress);

    form.addEventListener('submit', function (event) {
        if (event.submitter !== submitButton) return;
        event.preventDefault();

        donationWei = amountToWei(amountInput.value);
        if (!donationWei) {
            status.textContent = 'Enter a valid ETH amount.';
            amountInput.focus();
            return;
        }

        window.dispatchEvent(new Event('eip6963:requestProvider'));
        showWalletStep();
    });
}());
