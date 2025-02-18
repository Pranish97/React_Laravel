import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axiosClient from "../axios-client"

export default function UserForm(){
    const {id} = useParams()
    const navigate =useNavigate();
    const [loading,setLoading] = useState(false)
    const [user, setUsers] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })
    const [errors, setErrors] = useState(null)

    if(id) {
        useEffect(()=>{
            setLoading(true)
            axiosClient.get(`/users/${id}`)
            .then(({data})=>{
                setLoading(false)
                setUsers(data)
            })
            .catch(()=>{
                setLoading(false)
            })
        }, [])
    }

    const onSubmit = (ev) =>{
        ev.preventDefault();
        if(user.id){
            axiosClient.put(`/users/${user.id}`, user)
            .then(()=>{
                //TODO show notofocation
                navigate('/users')
            })
            .catch(err =>{
                const response = err.response;
                if(response && response.status === 422){
                    setErrors(response.data.errors)
                }
            })
        }else{
            axiosClient.post(`/users`, user)
            .then(()=>{
                //TODO show notofocation
                navigate('/users')
            })
            .catch(err =>{
                const response = err.response;
                if(response && response.status === 422){
                    setErrors(response.data.errors)
                }
            })

        }
    }

     
    return(
        <>
        {user.id && <h1>Update User: {user.name}</h1>}
        {!user.id && <h1>New User</h1>}
        <div className="card animated fadeInDown">
            {loading && (
                <div className="text-center">Loading...</div>
            )}

            {
                errors && <div className="alert">
                {Object.keys(errors).map(key => (
                    <p key={key}>{errors[key][0]}</p>
                ))}
                </div>
            }
            {!loading &&
            <form onSubmit={onSubmit}>
                <input value={user.name} onChange={ev => setUsers({...user, name: ev.target.value})} placeholder="Name"/>
                <input type="email" value={user.email} onChange={ev => setUsers({...user, email: ev.target.value})} placeholder="Email"/>
                <input type="password" onChange={ev => setUsers({...user, password: ev.target.value})} placeholder="Password"/>
                <input type="password" onChange={ev => setUsers({...user, password_confirmation: ev.target.value})} placeholder="Password Confirmation"/>
                <button className="btn btn-save">Save</button>
            </form>

            }
        </div>
        </>
    )
}