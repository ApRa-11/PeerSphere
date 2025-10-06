import React from 'react';

function Footer() {
  const styles = {
    footer: {
      width: '100%',
      padding: '25px 5%', // responsive padding
      boxSizing: 'border-box', // includes padding in width
      backgroundColor: '#222',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontSize: '0.95rem',
      gap: '10px',
    },
    container: {
      width: '100%',
      maxWidth: '1200px', // prevents overflow on large screens
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    links: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    link: {
      color: '#fff',
      textDecoration: 'none',
      transition: 'opacity 0.2s ease',
    },
    email: {
      marginTop: '5px',
      fontSize: '0.9rem',
      color: '#ccc',
    },
    tagline: {
      marginTop: '10px',
      fontSize: '1rem',
      fontStyle: 'italic',
      color: '#bbb',
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.links}>
          <a href="/" style={styles.link}>Home</a>
          <a href="/feed" style={styles.link}>Feed</a>
          <a href="/about" style={styles.link}>About</a>
          <a href="/contact" style={styles.link}>Contact</a>
        </div>
        <div style={styles.email}>
          <p>Contact us: support@peersphere.com</p>
        </div>
        <div style={styles.tagline}>
          <p>Connecting your campus, one post at a time.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
