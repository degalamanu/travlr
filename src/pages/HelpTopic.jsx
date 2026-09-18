import { Link, useParams } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { Accordion, EmptyState } from '../components/ui/Bits'
import { HELP_TOPICS } from '../data/content'

export default function HelpTopic() {
  const { topic } = useParams()
  const t = HELP_TOPICS.find((x) => x.id === topic)

  if (!t) {
    return (
      <div className="shell py-16">
        <EmptyState
          icon="help"
          title="No such help topic"
          body="It may have been renamed. Everything we have is on the help centre home page."
          action={
            <Link to="/help" className="btn-primary">
              <Icon name="arrowLeft" size={16} /> Help centre
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="shell py-4">
          <Link to="/help" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink-muted transition-colors hover:text-indigo-700">
            <Icon name="arrowLeft" size={16} />
            Help centre
          </Link>
        </div>
      </div>

      <div className="shell grid gap-8 py-10 lg:grid-cols-[1fr_280px]">
        <div>
          <h1 className="text-[28px] font-semibold text-navy">{t.title}</h1>
          <p className="mt-2 text-[15px] text-ink-muted">{t.blurb}</p>
          <div className="mt-6">
            <Accordion items={t.articles} idPrefix={t.id} />
          </div>

          <div className="card mt-8 flex flex-wrap items-center justify-between gap-4 p-5">
            <p className="text-[14px] text-ink-muted">Didn’t answer it? We reply within one working day.</p>
            <a href="mailto:help@travlr.example" className="btn-primary btn-sm">
              <Icon name="mail" size={15} /> Email support
            </a>
          </div>
        </div>

        <aside className="lg:sticky lg:top-[120px] lg:h-fit">
          <div className="card p-5">
            <h2 className="text-[14.5px] font-semibold text-navy">Other topics</h2>
            <div className="mt-3 space-y-2">
              {HELP_TOPICS.filter((x) => x.id !== t.id).map((x) => (
                <Link
                  key={x.id}
                  to={`/help/${x.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line px-3.5 py-2.5 text-[13.5px] transition-colors hover:border-indigo-300"
                >
                  <span className="font-medium text-navy">{x.title}</span>
                  <Icon name="chevronRight" size={15} className="shrink-0 text-ink-soft" />
                </Link>
              ))}
            </div>
          </div>

          <div className="card mt-4 p-5">
            <h2 className="text-[14.5px] font-semibold text-navy">Useful links</h2>
            <div className="mt-3 space-y-2 text-[13.5px]">
              <Link to="/legal/privacy" className="block text-ink-muted hover:text-indigo-700">Privacy policy</Link>
              <Link to="/legal/terms" className="block text-ink-muted hover:text-indigo-700">Terms of use</Link>
              <Link to="/about" className="block text-ink-muted hover:text-indigo-700">How Travlr makes money</Link>
              <Link to="/trips?tab=settings" className="block text-ink-muted hover:text-indigo-700">Your settings</Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
