import {
  List,
  ListItem,
  Paper,
  Typography,
  Select,
  MenuItem,
  Stack,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { scaleValues, getScaleDescription } from './constants';
import { ComparisonViewProps } from './types';

const ListView = ({
  items,
  comparisons,
  onChange,
  onValueSelect
}: ComparisonViewProps) => {
  const handleComparisonChange = (item1Id: string, item2Id: string, value: number) => {
    const newComparisons = { ...comparisons };
    newComparisons[item1Id] = { ...newComparisons[item1Id] };
    newComparisons[item2Id] = { ...newComparisons[item2Id] };
    newComparisons[item1Id][item2Id] = value;
    newComparisons[item2Id][item1Id] = 1 / value;
    onChange(newComparisons);
    onValueSelect?.(value);
  };

  const formatValue = (value: number) => {
    if (value === 1) return '1';
    return value < 1 ? `1/${Math.round(1/value)}` : value.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={0} sx={{ p: 4 }}>
        <List>
          {items.map((item1, i) => 
            items.map((item2, j) => {
              if (i >= j) return null;
              return (
                <motion.div
                  key={`${item1.id}-${item2.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i * items.length + j) * 0.1 }}
                >
                  <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 2 }}>
                    <Typography>
                      Compare: <strong>{item1.name}</strong> vs <strong>{item2.name}</strong>
                    </Typography>
                    <Stack spacing={1} sx={{ px: 2 }}>
                      <Select
                        size="small"
                        value={comparisons[item1.id]?.[item2.id] || 1}
                        onChange={(e) => 
                          handleComparisonChange(item1.id, item2.id, Number(e.target.value))
                        }
                      >
                        {scaleValues.map((value) => (
                          <MenuItem key={value} value={value}>
                            {formatValue(value)}
                          </MenuItem>
                        ))}
                      </Select>
                      <Typography variant="caption" color="text.secondary" align="center">
                        {getScaleDescription(comparisons[item1.id]?.[item2.id] || 1)}
                      </Typography>
                    </Stack>
                  </ListItem>
                  {i < items.length - 1 && <Divider />}
                </motion.div>
              );
            })
          )}
        </List>
      </Paper>
    </motion.div>
  );
};

export default ListView; 