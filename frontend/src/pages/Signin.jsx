import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { ButtonWarning } from "../components/ButtonWarning";
export const Signin = () => {
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Signin"} />
          <SubHeading
            label={"Enter your credentials to Login into your account"}
          />

          <InputBox placeholder="saigopimorla@gmail.com" label={"Email"} />
          <InputBox placeholder="123456" label={"Password"} />
          <div className="pt-4">
            <Button label={"Signin"} />
          </div>
          <ButtonWarning
            label={"Don't have an account?"}
            buttonText={"Signup"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
