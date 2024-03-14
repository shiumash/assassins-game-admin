import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../supabaseClient';
import { useEffect, useState } from 'react';
import '../App.css'

function Home() {

  const [user, setUser] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState([]);
  const [isEliminated, setIsEliminated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => { 
    getPlayers();

    // eslint-disable-next-line 
     const getUserData = async () => {
      await supabaseClient.auth.getUser().then((value) => {
        if (value.data?.user) {
          setUser(value.data.user);
        }
      })
    }
    getUserData()
  }, [])

  const signOutUser = async () => {
    // eslint-disable-next-line 
    const { error } = await supabaseClient.auth.signOut()
    navigate("/")
  }

  const addPlayer = async () => {
    try {
      // eslint-disable-next-line
      const { data, error } = await supabaseClient
        .from('players')
        .insert({name: playerName, eliminated: isEliminated})
        .single();

      if (error) throw error;
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  }

  const getPlayers = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('players')
        .select('*')
        .limit(50);
      
        if (error) throw error;

        if (data != null) { setPlayers(data)};
    } catch (error) {
      alert(error.message);
    }

  }

  const eliminatePlayer = async (id, currentStatus) => {
    const newStatus = !currentStatus
    try {
      setIsEliminated(!isEliminated);
      // eslint-disable-next-line
      const { data, error } = await supabaseClient
        .from('players')
        .update({
          eliminated: newStatus
        })
        .eq('id', id)
      if (error) throw error;
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  }

  const deletePlayer = async (id) => {
    try {
      // eslint-disable-next-line
      const { data, error } = await supabaseClient
        .from('players')
        .delete()
        .eq('id', id);
      if (error) throw error;
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  }

  const resetTable = async () => {
    try {
      const {data, error} = await supabaseClient
        .from('players')
        .insert('TRUNCATE players RESTART IDENTITY;')

        if (error) {
          console.error('Error executing command:', error.message);
        } else {
          console.log('Command executed successfully:', data);
        }
    }
    catch (error) {
      console.error('Error executing command:', error.message);
    }
  }
  

  return (
    <div className="App">
      <header className="App-header" style={{"paddingLeft": "16px", "paddingTop": "8px"}}>
        <h1 style={{"fontSize": "28px", "fontWeight": "bolder"}}>
          Assassins Game - Admin 🔫
        </h1>
      </header>
      <div className="App-body">
        {
          Object.keys(user).length !== 0 ?
            <div className='content_container'>
              <div className="add_player_container">
                <label style={{"fontWeight": "bold"}}>Player Creation</label>
                <div className="add_player_container_input">
                  <input type="text" className='add_player_container_input_text' id="name" onChange={(e) => setPlayerName(e.target.value)}/>
                  <button className='btn btn-outline-success add_player_container_input_btn' onClick={(e) => addPlayer()}>Add Player</button>
                </div>
              </div>
              <div style={{"margin": "24px 0"}}>
                <hr />
              </div>
              <table className="player_table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Eliminated?</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    players.map(player => (
                      <tr>
                        <th scope="row" key={player.id}>{player.id}</th>
                        <td>{player.name}</td>
                        <td style={{"textAlign": "center"}}>{player.eliminated ? '✅' : '❌'}</td>
                        <td>
                          <button className="btn btn-outline-danger" onClick={() => eliminatePlayer(player.id, player.eliminated)}>Eliminate Player</button>
                          <button className="btn btn-outline-secondary" style={{"marginLeft": "1rem"}} onClick={() => deletePlayer(player.id)}>Delete Player</button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <div className="command_buttons_container">
                <button className="btn btn-dark" onClick={() => signOutUser()}>Sign Out</button>
                <button className="btn btn-danger" style={{ "marginLeft": "16px" }} onClick={() => resetTable()}>Reset Table *CAREFUL*</button>
              </div>
            </div>
          :
            <>
              <h1>User is not logged in</h1>
              <button onClick={() => { navigate("/") }}>Take me back!</button>
            </>
        }
      </div>
    </div>
  );
}

export default Home;
