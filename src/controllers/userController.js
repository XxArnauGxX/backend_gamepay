import {
  registerService,
  loginService,
  refreshTokenService,
  logoutService,
} from '../services/userService.js';

export async function register(req, res) {
  try {
    const result = await registerService(req.body);
    return res.status(201).json(result);
  } catch (e) {
    if (e.statusCode === 409 || e.message === 'User already exists') {
      return res.status(409).json({ error: e.message });
    }
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await loginService(
      email,
      password
    );

    return res.status(200).json({
      message: 'Login exitoso',
      accessToken,
      refreshToken,
      user,
    });
  } catch (e) {
    if (e.statusCode === 401 || e.message === 'Credenciales inválidas') {
      return res.status(401).json({ error: e.message });
    }
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function refreshTokenUser(req, res) {
  try {
    const refreshFromClient = req.headers['x-refresh-token'];
    if (!refreshFromClient) {
      return res.status(400).json({ error: 'Se requiere refresh token' });
    }
    const { accessToken, refreshToken } =
      await refreshTokenService(refreshFromClient);
    return res.status(200).json({ accessToken, refreshToken });
  } catch (e) {
    if (e.statusCode === 401) {
      return res.status(401).json({ error: e.message });
    }
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function logoutUser(req, res) {
  try {
    const refreshFromClient = req.headers['x-refresh-token'];
    if (!refreshFromClient) {
      return res
        .status(400)
        .json({ error: 'Se requiere refresh token para logout' });
    }
    await logoutService(refreshFromClient);
    return res.status(200).json({ message: 'Logout exitoso' });
  } catch (e) {
    if (e.statusCode === 401) {
      return res.status(401).json({ error: e.message });
    }
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
