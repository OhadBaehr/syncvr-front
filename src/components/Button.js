const Button = ({setCounter,counter}) => {

 const handleClick = () => {
    setCounter(counter + 1)
    setCounter(counter + 1)
    setCounter(counter + 1)
 }
  return (
    <button className="bg-red-400" onClick={handleClick}>
      +
    </button>
  );
};

export default Button;
