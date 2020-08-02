
document.querySelector('#otpBtn').addEventListener('click', (e) => {
    document.querySelectorAll('.message-hidden').forEach(e => e.style.display = 'block')
    e.preventDefault()
    fetch('/auth/user/sendOtp', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: document.querySelector('#username').value })
    }).then((res) => res.json()).then(res => {
        const { success } = res;
        if (success) {
            document.querySelectorAll('.hidden-at-first').forEach(e => e.style.display = 'block')
            document.querySelector('#otpBtn').style.display = 'none';
        } else {
            alert(res.error)
        }
    })
})
