"use client";

interface ICard {
  children: any;
  className?: string;
  style?: any;
}
function Card(props: ICard) {
  const { children, className, style } = props;
  return (
    <div style={style} className={`bg-white rounded-3xl		${className}`}>
      {children}
    </div>
  );
}

export default Card;
