import { createParam } from 'solito'
import { ServiceDetailScreen } from 'app/features/services/detail-screen'

const { useParam } = createParam<{ id: string }>()

export default function Screen() {
  const [id] = useParam('id')
  if (!id) return null
  return <ServiceDetailScreen id={id} />
}
