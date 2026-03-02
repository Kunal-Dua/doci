type DocBuilderProps = {
  onClick: () => void;
  title: string;
  src: string;
};

const DocBuilder = ({ onClick, title, src }: DocBuilderProps) => {
  return (
    <div className="flex flex-col gap-1 m-1 w-30">
      <img className="h-40 w-30 border-amber-950" onClick={onClick} alt="" />
      <div className="flex justify-center">{title}</div>
    </div>
  );
};

export default DocBuilder;
