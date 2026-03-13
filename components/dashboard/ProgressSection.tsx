import { CheckCircle, Lock, FlaskConical, BookOpen, Bot } from 'lucide-react'

export function ProgressSection({ profile }: { profile: any }) {
  const hasTest = profile?.skillScores !== null && profile?.skillScores !== undefined
  const bootcampDone = Object.values(profile?.bootcampProgress || {})
    .flatMap((c: any) => c.completedDays || []).length
  const hasBootcamp = bootcampDone > 0
  const hasInterview = profile?.interviewScore !== null && profile?.interviewScore !== undefined
  const bootcampPercent = Math.round((bootcampDone / 7) * 100)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* Skill Test */}
      <div className={`border rounded-xl p-5 transition-colors ${
        hasTest
          ? 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800'
          : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          {hasTest
            ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            : <FlaskConical className="w-5 h-5 text-gray-400 shrink-0" />
          }
          <span className="font-semibold font-sans text-sm text-gray-800 dark:text-slate-200">
            Tes Keterampilan
          </span>
        </div>
        {hasTest ? (
          <p className="text-green-600 dark:text-green-400 font-sans text-sm">
            Selesai · Match score: <span className="font-mono font-bold">{profile.matchScore ?? 0}%</span>
          </p>
        ) : (
          <div>
            <p className="text-gray-500 dark:text-slate-400 font-sans text-sm mb-3">
              Belum dikerjakan
            </p>
            <a href="/tes"
              className="text-blue-600 dark:text-blue-400 font-sans text-sm font-semibold hover:underline">
              Mulai sekarang
            </a>
          </div>
        )}
      </div>

      {/* Bootcamp */}
      <div className={`border rounded-xl p-5 transition-colors ${
        !hasTest ? 'opacity-50 pointer-events-none' : ''
      } ${
        hasBootcamp
          ? 'border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800'
          : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          {hasBootcamp
            ? <BookOpen className="w-5 h-5 text-blue-500 shrink-0" />
            : <Lock className="w-5 h-5 text-gray-400 shrink-0" />
          }
          <span className="font-semibold font-sans text-sm text-gray-800 dark:text-slate-200">
            Bootcamp 7 Hari
          </span>
        </div>
        {!hasTest ? (
          <p className="text-gray-400 font-sans text-sm">Selesaikan tes dulu</p>
        ) : hasBootcamp ? (
          <div>
            <div className="flex justify-between text-xs font-sans mb-1.5">
              <span className="text-gray-500 dark:text-slate-400">Progress</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {bootcampPercent}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${bootcampPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <a href="/bootcamp"
            className="text-blue-600 dark:text-blue-400 font-sans text-sm font-semibold hover:underline">
            Mulai bootcamp
          </a>
        )}
      </div>

      {/* Interview */}
      <div className={`border rounded-xl p-5 transition-colors ${
        !hasTest ? 'opacity-50 pointer-events-none' : ''
      } ${
        hasInterview
          ? 'border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800'
          : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          {hasInterview
            ? <Bot className="w-5 h-5 text-purple-500 shrink-0" />
            : <Lock className="w-5 h-5 text-gray-400 shrink-0" />
          }
          <span className="font-semibold font-sans text-sm text-gray-800 dark:text-slate-200">
            Simulasi Wawancara
          </span>
        </div>
        {!hasTest ? (
          <p className="text-gray-400 font-sans text-sm">Selesaikan tes dulu</p>
        ) : hasInterview ? (
          <p className="text-purple-600 dark:text-purple-400 font-sans text-sm">
            Skor: <span className="font-mono font-bold">{profile.interviewScore}/100</span>
          </p>
        ) : (
          <a href="/wawancara"
            className="text-blue-600 dark:text-blue-400 font-sans text-sm font-semibold hover:underline">
            Mulai simulasi
          </a>
        )}
      </div>

    </div>
  )
}
