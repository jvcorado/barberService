const Loading = () => {
  return (
    <div className=" flex w-full h-full items-center justify-center ">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
