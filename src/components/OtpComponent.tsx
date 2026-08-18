import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import NodeApi from '../NodeApi'

type OtpComponentProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const OtpComponent = ({ open, onOpenChange }: OtpComponentProps) => {
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [userFound, setUserFound] = useState(false)
    const [error, setError] = useState('')

    const isEmailValid =
        email.trim().includes('@') && email.trim().includes('.')

    const resetState = () => {
        setEmail('')
        setOtp('')
        setUserFound(false)
        setError('')
    }

    const handleDialogChange = (nextOpen: boolean) => {
        onOpenChange(nextOpen)

        if (!nextOpen) {
            resetState()
        }
    }

    const handleSendOtp = async () => {
        if (!isEmailValid) return

        setError('')

        try {
            const response = await NodeApi.post('/auth/check_user', {
                email: email.trim().toLowerCase(),
            })

            if (response?.data?.success) {
                setUserFound(true)
            } else {
                setUserFound(false)
                setError(
                    response?.data?.msg
                )
            }
        } catch (error) {
            console.error('error:', error)

            setUserFound(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="sm:max-w-md bg-zinc-950 border border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        Login with OTP
                    </DialogTitle>

                    <DialogDescription className="text-zinc-400">
                        {userFound
                            ? 'Enter the OTP sent to your email.'
                            : 'Enter your email to continue.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    {!userFound ? (
                        <>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="otp-email"
                                    className="text-zinc-200"
                                >
                                    Email
                                </Label>

                                <Input
                                    id="otp-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value)
                                        setError('')
                                    }}
                                    placeholder="Enter your email"
                                    className="bg-black border-white/10 text-white placeholder:text-zinc-500 h-11"
                                />

                                {error && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={!isEmailValid}
                                className="w-full bg-white text-black hover:bg-zinc-200"
                            >
                                Send OTP
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="otp-code"
                                    className="text-zinc-200"
                                >
                                    Enter OTP
                                </Label>

                                <Input
                                    id="otp-code"
                                    type="text"
                                    inputMode="numeric"
                                    value={otp}
                                    onChange={(event) =>
                                        setOtp(
                                            event.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 6)
                                        )
                                    }
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    className="bg-black border-white/10 text-white placeholder:text-zinc-500 h-11"
                                />
                            </div>

                            <Button
                                type="button"
                                disabled={otp.length !== 6}
                                className="w-full bg-white text-black hover:bg-zinc-200"
                            >
                                Verify OTP
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OtpComponent