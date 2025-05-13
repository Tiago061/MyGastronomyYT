import styles from './navbar.module.css'
import { LuShoppingCart, LuCircleUser, LuMenu} from "react-icons/lu";
import { Drawer } from "@mui/material"
import { useState } from 'react';
import { Link } from 'react-router-dom';


export default function NavBar() {
    const [openMenu, setOpenMenu] = useState(false)

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu)
    }

    return(
        <nav className={styles.navbarContainer}>
            <div className={styles.navbarItems}>
                <Link to={'/'}> 
                <img className={styles.logo} src="/logo.png" alt="" />
                </Link>
                
                <div className={styles.navbarLinksContainer}>
                    <Link to={'/'} href="" className={styles.navbarLink}>Home</Link>
                    <Link to={'/plates'} href="" className={styles.navbarLink}>Plates</Link>
                    <Link to={'/cart'}>
                        <LuShoppingCart className={styles.navbarLink} />
                    </Link>
                    <Link to={'/profile'}>
                        <LuCircleUser className={styles.navbarLink} />
                    </Link>
                    
                </div>
            </div>
            
            <div className={styles.mobileNavBarItems}>
                <img className={styles.logo} src="/logo.png" alt="" />
                <div className={styles.mobanavbarBtn}>
                    <LuShoppingCart className={styles.navbarLink} />
                    <LuMenu className={styles.navbarLink} onClick={handleOpenMenu}/>
                </div>
            </div>
            <Drawer
                anchor='right'
                open={openMenu}
                onClose={handleOpenMenu}
                >
                    <div className={styles.drawer}>
                    <Link to={'/'} href="" className={styles.navbarLink}>Home</Link>
                    <Link to={'/plates'} href="" className={styles.navbarLink}>Plates</Link>
                    <Link to={'/profile'} href="" className={styles.navbarLink}>Profile</Link>
                    </div>
                
            </Drawer>


        </nav>
    )
}