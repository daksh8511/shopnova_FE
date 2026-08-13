import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import {
  ShoppingCart,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react'

import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import ApiNode from '../NodeApi'


// validation schema
const signupSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must contain minimum 8 characters")
    .required("Password is required"),

  terms: Yup.boolean()
    .oneOf([true], "Accept terms and conditions")
})


const Signup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)


  // signup function
  const signup = async (values) => {

    try {
      const response = await ApiNode.post(
        "/auth/signup",
        {
          email: values?.email,
          password: values?.password,
          name: values?.name
        }
      )

      if (response.data?.success) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response?.data?.user))
        navigate('/')
      }

    } catch (error) {

      console.error("Signup Error:", error)

    }

  }


  const formik = useFormik({

    initialValues: {
      name: "",
      email: "",
      password: "",
      terms: false
    },

    validationSchema: signupSchema,

    onSubmit: signup

  })



  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden px-4 py-20">

      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />


      <div className="relative z-10 w-full max-w-4xl flex flex-col lg:flex-row gap-10 items-center">


        <div className="hidden lg:flex flex-col flex-1">

          <Link to="/" className="flex items-center gap-2.5 mb-10">

            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>

            <span className="text-white font-black text-xl">
              Shop<span className="text-zinc-400">Nova</span>
            </span>

          </Link>


          <h2 className="text-4xl font-black text-white">
            Shop smarter,
            <span className="text-zinc-400"> save more.</span>
          </h2>

        </div>



        <Card className="w-full lg:max-w-md bg-zinc-950 border border-white/10">


          <CardHeader className="pt-8 px-8">

            <h1 className="text-2xl font-black text-white">
              Create your account
            </h1>

            <p className="text-zinc-500 text-sm">
              Sign up and get ₹200 OFF
            </p>

          </CardHeader>



          <CardContent className="px-8 py-6">


            <form
              onSubmit={formik.handleSubmit}
              className="space-y-5"
            >


              {/* NAME */}

              <div className="space-y-2">

                <Label className="text-zinc-300">
                  Full Name
                </Label>

                <div className="relative">

                  <User
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <Input
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Daksh Sharma"
                    className="pl-9 bg-black text-white"
                  />

                </div>


                {
                  formik.touched.name &&
                  formik.errors.name &&
                  <p className="text-red-500 text-xs">
                    {formik.errors.name}
                  </p>
                }

              </div>




              {/* EMAIL */}

              <div className="space-y-2">

                <Label className="text-zinc-300">
                  Email Address
                </Label>


                <div className="relative">

                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />


                  <Input
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="you@example.com"
                    className="pl-9 bg-black text-white"
                  />

                </div>


                {
                  formik.touched.email &&
                  formik.errors.email &&
                  <p className="text-red-500 text-xs">
                    {formik.errors.email}
                  </p>
                }

              </div>

              {/* PASSWORD */}

              <div className="space-y-2">


                <Label className="text-zinc-300">
                  Password
                </Label>


                <div className="relative">

                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />


                  <Input

                    name="password"

                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }

                    value={formik.values.password}

                    onChange={formik.handleChange}

                    onBlur={formik.handleBlur}

                    placeholder="Create password"

                    className="pl-9 pr-10 bg-black text-white"

                  />


                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  >

                    {
                      showPassword
                        ?
                        <EyeOff size={15} />
                        :
                        <Eye size={15} />
                    }

                  </button>


                </div>


                {
                  formik.touched.password &&
                  formik.errors.password &&
                  <p className="text-red-500 text-xs">
                    {formik.errors.password}
                  </p>
                }


              </div>




              {/* TERMS */}

              <label className="flex gap-2 text-xs text-zinc-500">

                <input
                  type="checkbox"
                  name="terms"
                  onChange={formik.handleChange}
                />

                I agree to terms and privacy policy

              </label>


              {
                formik.touched.terms &&
                formik.errors.terms &&
                <p className="text-red-500 text-xs">
                  {formik.errors.terms}
                </p>
              }




              <Button
                type="submit"
                className="w-full bg-white text-black"
              >

                Create Account
                <ArrowRight size={15} />

              </Button>


              <Separator />


              <p className="text-center text-sm text-zinc-500">

                Already have account?

                <Link
                  to="/login"
                  className="text-white ml-1"
                >
                  Sign In
                </Link>

              </p>


            </form>


          </CardContent>

        </Card>


      </div>

    </div>
  )
}


export default Signup