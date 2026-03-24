import { NavLink, NavLinkProps } from 'react-router-dom';

interface AppNavLinkProps extends NavLinkProps {
  children: React.ReactNode;
}

export const AppNavLink = ({ to, children, ...props }: AppNavLinkProps) => {
  const activeClass = 'text-blue-600';
  const inactiveClass = 'text-gray-500 hover:text-blue-400 transition-colors';

  return (
    <NavLink
      to={to}
      {...props}
      className={({ isActive }) => {
        return `px-4 py-2 transition-all ${
          isActive ? activeClass : inactiveClass
        }`;
      }}
      aria-current={isActive}
    >
      {children}
    </NavLink>
  );
};
