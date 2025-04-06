import { useState } from 'react';
import { ethers } from 'ethers';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Divider, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import { 
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  AccountBalanceWallet as WalletIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { colors } from '../styles/colors';

export default function TokenCard({ token, account }) {
  const [copied, setCopied] = useState(false);
  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const copyAddress = () => {
    navigator.clipboard.writeText(token.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTokens = async () => {
    if (!recipient || !amount) return;
    
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        token.address, 
        [
          'function transfer(address to, uint256 amount) returns (bool)'
        ], 
        signer
      );
      
      const tx = await tokenContract.transfer(
        recipient, 
        ethers.parseUnits(amount, 18)
      );
      await tx.wait();
      setTxHash(tx.hash);
    } catch (error) {
      console.error("Error sending tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card sx={{ 
        backgroundColor: colors.background,
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.12)'
        }
      }}>
        <CardContent>
          {/* Token Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              color: colors.primary
            }}>
              {token.name}
            </Typography>
            <Chip 
              label={token.symbol} 
              sx={{ 
                backgroundColor: colors.secondary,
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
          </Box>

          {/* Token Details */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: colors.text }}>
              Total Supply: {ethers.formatUnits(token.supply, 18)}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Token Address */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: colors.text }}>
              Contract Address:
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mt: 0.5
            }}>
              <Typography variant="body2" sx={{ 
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: colors.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {token.address}
              </Typography>
              <Button 
                size="small" 
                onClick={copyAddress}
                sx={{ 
                  minWidth: '32px',
                  ml: 1,
                  color: copied ? colors.success : colors.primary
                }}
              >
                {copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
              </Button>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<WalletIcon />}
              fullWidth
              sx={{
                backgroundColor: colors.accent,
                color: colors.primary,
                '&:hover': {
                  backgroundColor: colors.secondary,
                  color: 'white'
                }
              }}
              onClick={() => window.open(`https://sepolia.tea.xyz/address/${token.address}`, '_blank')}
            >
              View
            </Button>
            
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              fullWidth
              sx={{
                backgroundColor: colors.primary,
                color: 'white',
                '&:hover': {
                  backgroundColor: colors.secondary
                }
              }}
              onClick={() => setOpenSendDialog(true)}
              disabled={!account}
            >
              Send
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Send Tokens Dialog */}
      <Dialog open={openSendDialog} onClose={() => setOpenSendDialog(false)}>
        <DialogTitle sx={{ color: colors.primary }}>
          Send {token.symbol} Tokens
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              fullWidth
            />
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <Chip label={token.symbol} size="small" />
                )
              }}
            />
          </Box>
          
          {txHash && (
            <Box sx={{ mt: 2, p: 1, backgroundColor: colors.background, borderRadius: 1 }}>
              <Typography variant="body2" sx={{ color: colors.success }}>
                Transaction successful!
              </Typography>
              <Typography variant="caption" sx={{ 
                fontFamily: 'monospace',
                wordBreak: 'break-all'
              }}>
                {txHash}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenSendDialog(false);
              setTxHash('');
            }}
            sx={{ color: colors.text }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendTokens}
            disabled={loading || !recipient || !amount}
            variant="contained"
            sx={{ 
              backgroundColor: colors.primary,
              '&:hover': { backgroundColor: colors.secondary }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}