import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ImageList, ImageListItem, Button } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${size * rows
      }&fit=crop&auto=format&dpr=2 2x`,
  };
}

function getGridSize(index: number, total: number) {
  if (total === 1) return { cols: 4, rows: 2.5 }; // Foto única ocupa todo
  if (total === 2) return { cols: 2, rows: 2.5 }; // Dos fotos lado a lado
  if (total === 3) {
    if (index === 0) return { cols: 4, rows: 2.5 }; // Primera grande
    return { cols: 2, rows: 1.5 }; // Otras pequeñas
  }
  if (total === 4) return { cols: 2, rows: 1.5 }; // Cuatro cuadradas
  // 5 o más → distribución variada estilo collage
  if (index % 5 === 0) return { cols: 2, rows: 1.5 };
  return { cols: 2, rows: 1.5 };
}

export const Collage = ({ photos }: { photos: string[] }) => {

  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
      <Grid container spacing={1}>
        <Grid size={12}>
          <ImageList
            sx={{ width: '100%', height: '50vh' }}
            variant="quilted"
            cols={4}
            rowHeight={121}
          >
            {photos.map((photo: string, index: number) => {
              const { cols, rows } = getGridSize(index, photos.length);
              return (
                <ImageListItem key={photo} cols={cols} rows={rows}>
                  <img
                    {...srcset(photo, 121, rows, cols)}
                    alt={photo}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 20
                    }}
                    loading="lazy"
                  />
                </ImageListItem>
              );
            })}
          </ImageList>
        </Grid>
      </Grid>
      <Grid spacing={1} marginTop={5}>
        <Grid size={12}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            fullWidth={true}
            startIcon={<CloudUploadIcon />}
          >
            Agregar Foto
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => console.log(event.target.files)}
              multiple
            />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
