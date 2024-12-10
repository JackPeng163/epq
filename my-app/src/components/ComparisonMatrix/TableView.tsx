import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Stack,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { scaleValues } from './constants';
import { ComparisonViewProps } from './types';

const TableView = ({
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
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                {items.map((item) => (
                  <TableCell key={item.id} align="center">
                    {item.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item1, i) => (
                <TableRow key={item1.id}>
                  <TableCell component="th" scope="row">
                    {item1.name}
                  </TableCell>
                  {items.map((item2, j) => (
                    <TableCell key={item2.id} align="center">
                      {i === j ? (
                        '1'
                      ) : i < j ? (
                        <Stack spacing={1} sx={{ minWidth: 150 }}>
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
                        </Stack>
                      ) : (
                        formatValue(comparisons[item1.id]?.[item2.id] || 1)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </motion.div>
  );
};

export default TableView; 