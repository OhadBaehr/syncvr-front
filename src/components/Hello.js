const Hello = ({ title, value }) => {
  return (
    <div className="w-full bg-slate-300 flex flex-col justify-center gap-5 items-center">
      <h1 className="font-bold text-3xl">{title}</h1>
      <p className="">{value}</p>
    </div>
  );
};

export default Hello;
