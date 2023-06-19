import Button from "../Button";
import Input from "../Input";

interface ILoginForm {
  userInfo: {
    AccessKeyId: string;
    secretKey: string;
  };
  setUserInfo: (value: any) => {};
  onLogin: () => {};
  loading?: boolean;
  label?: string;
}

const LoginForm = ({ userInfo, setUserInfo, onLogin, loading, label = "Login" }: ILoginForm) => {
  return (
    <div>
      <div className="text-center text-2xl font-bold">{label}</div>
      <div className="flex flex-row flex-1 gap-4 my-4">
        <Input
          value={userInfo?.AccessKeyId}
          onChange={(e: any) => setUserInfo({ ...userInfo, AccessKeyId: e?.target?.value })}
          label="Access Key"
        />
        <Input
          value={userInfo?.secretKey}
          onChange={(e: any) => setUserInfo({ ...userInfo, secretKey: e?.target?.value })}
          label="Secret Key"
        />
      </div>
      <Button
        title={"Login"}
        loading={loading}
        disabled={loading || !(userInfo?.AccessKeyId && userInfo?.secretKey)}
        onClick={onLogin}
      />
    </div>
  );
};
export default LoginForm;
