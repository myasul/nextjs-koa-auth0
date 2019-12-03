import Link from "next/link"
import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"

export default function AppNavbar ({ user }) {
    const navBarStyle = { marginBottom: "25px" }
    return (
        <Navbar bg="dark" variant="dark" expand="lg" style={navBarStyle}>
            <Container>
                <Navbar.Brand>
                    <Link href="/">
                        <a>Thoughts!</a>
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {user &&
                            <>
                                <Link href="/share-thought">
                                    <a className="nav-link">New Thought</a>
                                </Link>
                                <Link href="/profile">
                                    <a className="nav-link">Profile</a>
                                </Link>
                                <Link href="/logout">
                                    <a className="nav-link">Logout</a>
                                </Link>
                            </>
                        }
                        {!user &&
                            <Link href="/login">
                                <a className="nav-link">Login</a>
                            </Link>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}