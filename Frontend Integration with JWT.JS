fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('currentUser', data.username);
    localStorage.setItem('userRole', data.role);
    if (data.role === 'admin') window.location.href = 'admin.html';
    else if (data.role === 'driver') window.location.href = 'driver.html';
    else if (data.firstLogin) window.location.href = 'reset.html';
    else window.location.href = 'employee.html';
  } else {
    // show error
  }
});