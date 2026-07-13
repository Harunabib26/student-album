import { useState } from 'react'
import { usePaystackPayment } from 'react-paystack'
import { supabase } from '../lib/supabaseClient'

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

export default function PaymentCard({ studentId, userEmail, onPaymentSuccess }) {
  const [amount, setAmount] = useState(500)
  const [amountError, setAmountError] = useState('')
  const [verifying, setVerifying] = useState(false)

  // Paystack config — amount is in kobo (1 Naira = 100 kobo)
  const config = {
    reference: `album_${studentId}_${Date.now()}`,
    email: userEmail,
    amount: amount * 100, // convert Naira to kobo
    publicKey: PAYSTACK_KEY,
    currency: 'NGN',
    metadata: {
      student_id: studentId,
      custom_fields: [
        { display_name: 'Purpose', variable_name: 'purpose', value: 'Album Premium Upgrade' },
      ],
    },
  }

  const initializePayment = usePaystackPayment(config)

  function handleAmountChange(e) {
    const val = Number(e.target.value)
    setAmount(val)
    if (val < 500) {
      setAmountError('Minimum amount is ₦500')
    } else {
      setAmountError('')
    }
  }

  async function handleSuccess(response) {
    setVerifying(true)
    console.log('Paystack payment successful:', response)

    // Mark student as premium in Supabase
    const { error } = await supabase
      .from('students')
      .update({ is_premium: true })
      .eq('id', studentId)

    setVerifying(false)

    if (error) {
      alert('Payment was successful but we could not upgrade your account. Please contact support.')
      console.error(error)
    } else {
      onPaymentSuccess() // tell parent component to refresh
    }
  }

  function handleClose() {
    console.log('Paystack popup closed by user')
  }

  function handlePayNow() {
    if (amount < 500) {
      setAmountError('Minimum amount is ₦500')
      return
    }
    initializePayment({ onSuccess: handleSuccess, onClose: handleClose })
  }

  return (
    <div className="bg-cream border-2 border-brass p-6 shadow-polaroid mb-8 relative overflow-hidden">
      {/* Decorative corner tape */}
      <div
        className="absolute top-0 right-0 w-16 h-16"
        style={{
          background: 'linear-gradient(135deg, transparent 50%, rgba(201,162,39,0.15) 50%)',
        }}
      />

      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">📸</span>
        <p className="seal px-3 py-1 w-fit">Premium Album</p>
      </div>

      <h2 className="font-display text-2xl font-bold text-ink mt-3 mb-1">
        Unlock Unlimited Photos
      </h2>
      <p className="text-sm text-ink-light mb-5">
        You've used your 2 free photo slots. Pay a one-time fee to upload as many photos as you like to your album.
      </p>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Choose your amount{' '}
          <span className="text-ink-light font-normal">(minimum ₦500)</span>
        </label>
        <div className="flex items-center border-2 border-ink/30 focus-within:border-brass bg-parchment">
          <span className="px-3 py-2 font-bold text-brass border-r-2 border-ink/20">₦</span>
          <input
            type="number"
            min={500}
            step={100}
            value={amount}
            onChange={handleAmountChange}
            className="flex-1 px-3 py-2 bg-transparent outline-none"
          />
        </div>
        {amountError && (
          <p className="text-maroon text-xs mt-1">{amountError}</p>
        )}
      </div>

      <button
        onClick={handlePayNow}
        disabled={verifying || amount < 500}
        className="w-full bg-brass text-ink font-bold py-3 hover:bg-brass-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {verifying ? (
          <>
            <span className="animate-spin">⏳</span> Verifying payment…
          </>
        ) : (
          <>
            🔒 Pay ₦{amount.toLocaleString()} via Paystack
          </>
        )}
      </button>

      <p className="text-xs text-ink-light text-center mt-3">
        Secured by Paystack · One-time payment · No subscription
      </p>
    </div>
  )
}
