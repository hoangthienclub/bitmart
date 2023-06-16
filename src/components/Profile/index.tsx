
import ProfileIc from '../svg/Profile'
import MemoLogout from '../svg/Logout'

const Profile = ({
  userId,
  onLogout,
  userBalance = [],
}: {
  userId: string;
  onLogout: () => void;
  userBalance: any;
}) => {
    const balance = userBalance?.[0];
  if (userId)
    return (
      <div className="flex flex-row justify-center items-center">
        <ProfileIc className="mx-2" />
        <span>{userId}</span>

        {balance && (
          <div className="flex flex-1">
            <span className="pl-2 pr-[1px]"> - {balance?.balance} </span>
            <span>{balance?.currency}</span>
          </div>
        )}

        <MemoLogout onClick={onLogout} className="cursor-pointer ml-2 w-5 h-5" />
      </div>
    );
};

export default Profile