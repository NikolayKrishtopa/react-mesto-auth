export const BASE_URL = 'https://auth.nomoreparties.co'

export function handleRegister(password, email) {
  return fetch(`${BASE_URL}/signup`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ password, email }),
  }).then((res) => res.ok && res.json())
}

export function handleLogin(password, email) {
  return fetch(`${BASE_URL}/signin`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ password, email }),
  }).then((res) => res.ok && res.json())
}

export function handleCheckAuth() {
  return fetch(`${BASE_URL}/users/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    method: 'GET',
  }).then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
}
