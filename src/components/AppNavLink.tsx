import { NavLink, NavLinkProps } from 'react-router-dom';

interface AppNavLinkProps extends NavLinkProps {
  children: React.ReactNode;
}

export const AppNavLink = ({ to, children, ...props }: AppNavLinkProps) => {
  const activeClass = 'bg-[#f5f3ff] font-medium';
  const inactiveClass = 'text-[oklch(0.55_0_0)] hover:text-[oklch(0.30_0_0)]';

  return (
    <NavLink
      to={to}
      {...props}
      className={({ isActive }) => {
        return `px-4 py-2 transition-all duration-200 rounded-full text-sm inline-flex items-center justify-center ${
          isActive ? activeClass : inactiveClass
        }`;
      }}
    >
      {children}
    </NavLink>
  );
};
