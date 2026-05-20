import "./AdoptionForm.css"
import { useState } from "react"
import axios from "axios"

function AdoptionForm({ petId })
{
  //status message
  const [statusMessage, setStatusMessage] = useState('')
  //loading state
  const [loading, setLoading] = useState(false)
  //adoption form data
  const [adoptionForm, setAdoptionForm] = useState(
  {
    adoptionMessage: '',
  })

  //submit adoption request
  async function handleAdoption(e)
  {
    //stop page refresh
    e.preventDefault()
    //simple validation check
    if(!adoptionForm.adoptionMessage)
    {
      setStatusMessage('Please write a message.')
      return
    }

    setLoading(true)

    try
    {
      //take token from local storage
      const token = localStorage.getItem('token')
      //send adoption request to backend api
      const response = await axios.post(
        'http://localhost:8000/api/adoptions',

      {
        pet_id: petId,
        message: adoptionForm.adoptionMessage,
      },

      {
        headers:
        {
          Authorization: `Bearer ${token}`,
        },
      })

      //show response in browser console
      console.log(response.data)
      setStatusMessage('Adoption request sent successfully.')

      //clear form
      setAdoptionForm(
      {
        adoptionMessage: '',
      })
    }

    //if request fails
    catch(error)
    {
      if(error.response && error.response.data && error.response.data.error)
      {
        setStatusMessage(error.response.data.error)
      }
      else
      {
        setStatusMessage('Failed to send adoption request.')
      }
    }

    setLoading(false)
  }

  //jsx ui
  return(
    <div className="adoption-page">
      <div className="adoption-card">
        {/* left side */}
        <div className="adoption-left">
          <div>
            <h2>Give a Pet a Home</h2>
            <p>
              Send an adoption request and help
              a pet find a loving family.
            </p>
          </div>
        </div>
        {/* right side */}
        <div className="adoption-right">
          <h1>Adoption Request</h1>
          <form onSubmit={handleAdoption}>
            <h2>Your Message</h2>

            <textarea
              name="message"
              placeholder="Write why you want to adopt this pet..."
              value={adoptionForm.adoptionMessage}

              //update adoption message
              onChange={(e) =>
                setAdoptionForm(
                {
                  ...adoptionForm,
                  adoptionMessage: e.target.value,
                })
              }
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </form>

          {/* feedback message */}
          <p className="adoption-message">
            {statusMessage}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdoptionForm
