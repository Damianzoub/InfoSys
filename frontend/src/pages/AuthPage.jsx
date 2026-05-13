import "./AuthPage.css"
import { useState} from 'react'

function AuthPage()
{
  //mode for switching between login/register form
  const [mode, setMode] = useState('login')
  //message shown under the forms
  const [message, setMessage] = useState('')
  //login form data
  const [loginForm, setLoginForm] = useState(
  {
    email: '',
    password: '',
  })

  //register form data
  const [registerForm, setRegisterForm] = useState(
  {
    name: '',
    email: '',
    password: '',
  })

  //login function
  function handleLogin(e)
  {
    //stop page refresh after submit
    e.preventDefault()
    //simple validation check
    if(!loginForm.email || !loginForm.password)
    {
      setMessage('Please fill all login fields.')
      return
    }

    //fake backend response(for now)
    const mockResponse =
    {
      token: 'mock-login-token',
      user:
      {
        email: loginForm.email,
      },
    }
    //show response in console
    console.log(mockResponse)
    //success message
    setMessage('Login successful.')
  }

  //register function
  function handleRegister(e)
  {
    //stop normal form submit
    e.preventDefault()
    //validation check
    if(!registerForm.name || !registerForm.email || !registerForm.password)
    {
      setMessage('Please fill all register fields.')
      return
    }

    //fake register response
    const mockResponse =
    {
      token: 'mock-register-token',
      user:
      {
        name: registerForm.name,
        email: registerForm.email,
      },
    }

    //print response in browser console
    console.log(mockResponse)
    //success message
    setMessage('Register successful.')
  }

  const [moveX, setMoveX] = useState(0)
  function handleMouseMove(e)
  {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const center = rect.width / 2
    const offset = (x - center) / center
    setMoveX(offset * 8)
  }
  //jsx ui
  return(
    <div className="auth-page">
      {/*<div className="paw-bg paw1"></div>
      <div className="paw-bg paw2"></div>
      <div className="paw-bg paw3"></div>*/}
      <div className="auth-card" onMouseMove={handleMouseMove}>
        {/* left side */}
        <div className="auth-left"  style={{transform: `translateX(${moveX}px)`}}>
          <div>
            <h2>Welcome Back</h2>
            <p>
              Please login or create an account
              to continue.
            </p>
          </div>
        </div>

        {/* right side */}
        <div className="auth-right">
          <h1>Pet Adoption Platform</h1>

          <div className="auth-tabs">

            {/*button for login mode */}
            <button
              className={mode === 'login' ? 'active-tab' : ''}
              onClick={() => setMode('login')}
            > Login
            </button>

            {/* button for register mode */}
            <button
              className={mode === 'register' ? 'active-tab' : ''}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>

          {/* show login form only if mode is login */}
          {mode=== 'login' &&
          (
            <form onSubmit={handleLogin}>
              <h2>Login</h2>

              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                //update login email
                onChange={(e) =>
                  setLoginForm(
                  {
                    ...loginForm,
                    email: e.target.value,
                  })
                }
              />

              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                //update login password
                onChange={(e) =>
                  setLoginForm(
                  {
                    ...loginForm,
                    password: e.target.value,
                  })
                }
              />

              <button type="submit">
                Login
              </button>
            </form>
          )}

          {/* show register form only if mode is register */}
          {mode === 'register' &&
          (
            <form onSubmit={handleRegister}>
              <h2>Register</h2>

              <input
                type="text"
                placeholder="Name"
                value={registerForm.name}
                //update register name
                onChange={(e) =>
                  setRegisterForm(
                  {
                    ...registerForm,
                    name: e.target.value,
                  })
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={registerForm.email}
                //update register email
                onChange={(e) =>
                  setRegisterForm(
                  {
                    ...registerForm,
                    email: e.target.value,
                  })
                }
              />

              <input
                type="password"
                placeholder="Password"
                value={registerForm.password}
                //update register password
                onChange={(e) =>
                  setRegisterForm(
                  {
                    ...registerForm,
                    password: e.target.value,
                  })
                }
              />

              <button type="submit">
                Register
              </button>
            </form>
          )}

          {/* feedback message */}
          <p className="auth-message">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
export default AuthPage