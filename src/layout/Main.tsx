interface MainLayoutProps {
  children: JSX.Element;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return <div className="flex m-100">{children}</div>;
};

export default MainLayout;
