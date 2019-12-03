import Container from "react-bootstrap/Container"
import fetch from "isomorphic-fetch"
import Thoughts from "../components/Thoughts"

function Index (props) {
    return (
        <Container>
            <p>STATUS CODE: {props.status_code}</p>
            <Thoughts thoughts={props.thoughts} />
        </Container>
    )
}

Index.getInitialProps = async ({ req }) => {
    const res = await fetch(`http://${req.headers.host}/api/thoughts`)
    const thoughts = await res.json()
    console.log(thoughts)
    return {
        thoughts: thoughts
    }
}

export default Index