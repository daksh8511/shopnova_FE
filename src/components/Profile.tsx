import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import useAuthStore from "../stores/user";

interface ProfileDataType {
    open: boolean;
    onOpenChange: () => void;
}

const Profile = ({ open, onOpenChange }: ProfileDataType) => {

    const { user } = useAuthStore()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>My Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-zinc-400">Name</p>
                        <p className="font-medium">{user?.name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-zinc-400">Email</p>
                        <p className="font-medium">{user?.email}</p>
                    </div>

                    <Button className="w-full">
                        Store
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Profile;