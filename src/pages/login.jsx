import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabaseClient } from '../supabaseClient';

function Login() {

  const navigate = useNavigate()

  supabaseClient.auth.onAuthStateChange( async (event) => {
    if (event === "SIGNED_IN") {
      navigate("/home")
    } else {
      navigate("/")
    }
  })

  return (
    <div className="App">
      <div className="App-body">
        <Auth 
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa}}
          theme="light"
          providers={["discord"]}
        />
      </div>
    </div>
  );
}

export default Login;
