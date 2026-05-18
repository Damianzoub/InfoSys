import "./AuthPage.css"
import { useState} from 'react'
import axios from 'axios'

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
  async function handleLogin(e)
  {
    //stop page refresh after submit
    e.preventDefault()
    //simple validation check
    if(!loginForm.email || !loginForm.password)
    {
      setMessage('Please fill all login fields.')
      return
    }

    try
    {
      //send login data to backend api
      const response = await axios.post('http://localhost:8000/api/auth/login',
      {
        email: loginForm.email,
        password: loginForm.password,
      })
      //show response in console
      console.log(response.data)

      //save token to local storage
      localStorage.setItem('token', response.data.token)
      //save user data to local storage
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setMessage('Login successful.')
      
      //clear login form
      setLoginForm(
      {
        email: '',
        password: '',
      })
    }
    //if request fails
    catch(error)
    {
      if(error.response && error.response.data && error.response.data.error)
      {
        setMessage(error.response.data.error)
      }
      else
      {
        setMessage('Login failed.')
      }
    }
  }

  //register function
  async function handleRegister(e)
  {
    //stop normal form submit
    e.preventDefault()
    //validation check
    if(!registerForm.name || !registerForm.email || !registerForm.password)
    {
      setMessage('Please fill all register fields.')
      return
    }

    try
    {
      //send register data to backend api
      const response = await axios.post('http://localhost:8000/api/auth/register',
      {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
      })
      //print response in browser console
      console.log(response.data)
      
      //save token to local storage
      localStorage.setItem('token', response.data.token)
      //save user data to local storage
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setMessage('Register successful.')
      
      //clear register form
      setRegisterForm(
      {
        name: '',
        email: '',
        password: '',
      })
    }
    //if request fails
    catch(error)
    {
      if(error.response && error.response.data && error.response.data.error)
      {
        setMessage(error.response.data.error)
      }
      else
      {
        setMessage('Register failed.')
      }
    }
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
                name="email"
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
                name="password"
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
                name="name"
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
                name="email"
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
                name="password"
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