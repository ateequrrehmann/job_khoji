import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Link, useNavigate } from "react-router";
import axios from 'axios'


import { Button } from '../ui/button'
import { RadioGroup } from '../ui/radio-group'
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import Store from '@/redux/store.js';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });

    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const { loading } = useSelector(Store => Store.auth);
    const dispatch = useDispatch();

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const formData = new FormData();
            formData.append("fullname", input.fullname);
            formData.append("email", input.email);
            formData.append("phoneNumber", input.phoneNumber);
            formData.append("password", input.password);
            formData.append("role", input.role);
            if (input.file) {
                formData.append("file", input.file)
            }
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        } finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex item-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    <div className='my-5'>
                        <Label>Full Name</Label>
                        <Input type="text" placeholder="ateeq" value={input.fullname} name="fullname" onChange={changeEventHandler} />
                    </div>
                    <div className='my-4'>
                        <Label>Email</Label>
                        <Input type="email" placeholder="ateeq@gmail.com" value={input.email} name="email" onChange={changeEventHandler} />
                    </div>
                    <div className='my-4'>
                        <Label>Phone Number</Label>
                        <Input type="text" placeholder="+92-3XXXXXXXXX" value={input.phoneNumber} name="phoneNumber" onChange={changeEventHandler} />
                    </div>
                    <div className='my-4'>
                        <Label>Password</Label>
                        <Input type="password" placeholder="" value={input.password} name="password" onChange={changeEventHandler} />
                    </div>
                    <div className='flex item-center justify-between'>
                        <RadioGroup className='flex item-center gap-4 my-5'>
                            <div className="flex items-center space-x-2">
                                <Input type='radio' name='role' value='student' className='cursor-pointer' checked={input.role === "student"} onChange={changeEventHandler} />
                                <Label htmlFor="r1">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input type='radio' name='role' value='recruiter' className='cursor-pointer' checked={input.role === "recruiter"} onChange={changeEventHandler} />

                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className="flex items-center gap-2">
                            <Label>Profile</Label>
                            <Input accept="image/*" type="file" className="cursor-pointer" onChange={changeFileHandler} />
                        </div>
                    </div>
                    {
                        loading ? <Button className="w-full my-4 cursor-pointer"><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait...</Button> : <Button type="submit" className="w-full my-4 cursor-pointer">Sign Up</Button>
                    }
                    <span className='text-sm'>Already have an account? <Link to="/login" className="text-blue-600">Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup
