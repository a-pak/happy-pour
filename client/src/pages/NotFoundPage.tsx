import { Box, Container, Typography } from "@mui/material"

const NotFoundPage = () => {
    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Box textAlign="center">
                <Typography variant="h4" gutterBottom>
                    Page not found
                </Typography>
                <Typography variant="subtitle1" color="text.primary" gutterBottom>
                    The page you are looking for does not exist. Were you looking for something else?
                </Typography>
                <Box
                    component="img"
                    src="/spilled-beer.png"
                    alt="Framed"
                    sx={{ width: '40vh', height: 'auto' }}
                />
                </Box>
        </Container>
    )
}
export default NotFoundPage;