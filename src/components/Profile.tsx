import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import useAuthStore from "../stores/user";
import NodeApi from "../NodeApi";

interface ProfileDataType {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const Profile = ({ open, onOpenChange }: ProfileDataType) => {
    const { user, updateUserAddress } = useAuthStore();
    const [area, setArea] = useState(user?.address?.area || "");
    const [city, setCity] = useState(user?.address?.city || "");
    const [state, setState] = useState(user?.address?.state || "");
    const [pincode, setPincode] = useState<string | number>(user?.address?.pincode || "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?._id) return;
        setLoading(true);
        setMessage(null);

        try {
            const numericPincode = Number(pincode);
            const response = await NodeApi.put(`/auth/set_address/${user._id}`, {
                area,
                city,
                state,
                pincode: numericPincode,
            });

            if (response?.data?.success) {
                updateUserAddress({
                    area,
                    city,
                    state,
                    pincode: numericPincode,
                });
                setMessage("Address saved successfully!");
                setTimeout(() => {
                    onOpenChange(false);
                }, 1000);
            }
        } catch (err) {
            console.error("Failed to update address", err);
            setMessage("Failed to save address. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">My Profile & Address</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-3 pb-3 border-b border-white/10">
                        <div>
                            <p className="text-xs text-zinc-400">Name</p>
                            <p className="font-semibold text-sm text-white">{user?.name || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-400">Email</p>
                            <p className="font-semibold text-sm text-white truncate">{user?.email || "N/A"}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSaveAddress} className="space-y-3">
                        <h4 className="text-sm font-semibold text-zinc-300">Delivery Address</h4>
                        
                        <div>
                            <Label className="text-xs text-zinc-400">Street / Area / Flat</Label>
                            <Input
                                placeholder="e.g. 102, Sunrise Heights, MG Road"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                className="bg-zinc-900 border-zinc-800 text-white text-sm mt-1"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-xs text-zinc-400">City</Label>
                                <Input
                                    placeholder="e.g. Mumbai"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="bg-zinc-900 border-zinc-800 text-white text-sm mt-1"
                                    required
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-zinc-400">State</Label>
                                <Input
                                    placeholder="e.g. Maharashtra"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className="bg-zinc-900 border-zinc-800 text-white text-sm mt-1"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs text-zinc-400">Pincode</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 400001"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="bg-zinc-900 border-zinc-800 text-white text-sm mt-1"
                                required
                            />
                        </div>

                        {message && (
                            <p className={`text-xs ${message.includes("success") ? "text-emerald-400" : "text-red-400"}`}>
                                {message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black hover:bg-zinc-200 mt-2 font-semibold"
                        >
                            {loading ? "Saving Address..." : "Save Address"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Profile;