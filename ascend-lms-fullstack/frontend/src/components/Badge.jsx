const styles = {
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
  gray: 'bg-black/5 text-ink/60',
  primary: 'bg-primary-50 text-primary-700'
};

const Badge = ({ children, color = 'gray' }) => (
  <span className={`badge ${styles[color] || styles.gray}`}>{children}</span>
);

export default Badge;
